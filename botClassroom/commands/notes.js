const { SlashCommandBuilder } = require('discord.js');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), '../credentials.json');
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notes')
    .setDescription('Llista les tasques de un curs')
    .addStringOption(option =>
      option.setName('nom_curs')
        .setDescription('Nom del curs del que vols veure les tasques')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nom_tasca')
        .setDescription('Nom de la tasca del que vols veure les notes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nom_alumne')
        .setDescription("Nom de l'alumne del que vols veure les notes")
        .setRequired(false)),
  async execute(interaction) {
    try {
      const auth = await authorize();
      const coursesID = await listCourses(auth);
      const courseName = interaction.options.getString('nom_curs');
      const courseId = coursesID[courseName];
      await interaction.deferReply({ ephemeral: true });
      if (!courseId) {
        interaction.editReply({ content: `No s'ha trobat el curs "${courseName}"`, ephemeral: true });
        return;
      }
      const tasksID = await listCourseWork(auth, courseId);
      const taskName = interaction.options.getString('nom_tasca');
      const taskID = tasksID[taskName];
      if (tasksID.length <= 0) {
        interaction.editReply({ content: `No s'han trobat tasques pel curs "${courseName}"`, ephemeral: true });
      } else if (!taskID) {
        interaction.editReply({ content: `No s'ha trobat la tasca "${taskName}"`, ephemeral: true });
      } else if (interaction.options.getString('nom_alumne')) {
        const alumne = interaction.options.getString('nom_alumne');
        const nota = await listStudentSubmissions(auth, courseId, taskID, alumne);
        interaction.editReply({ content: nota, ephemeral: true });
      } else {
        const notes = await listStudentSubmissions(auth, courseId, taskID, '');
        interaction.editReply({ content: notes, ephemeral: true });
      }
    } catch (err) {
      console.error(err);
      interaction.editReply({ content: 'Ha succeït un error en obtenir les tasques de Google Classroom.', ephemeral: true });
    }
  },
};
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listCourses(auth) {
  const classroom = google.classroom({ version: 'v1', auth });
  const res = await classroom.courses.list({
    pageSize: 0,
  });
  const courses = res.data.courses;
  if (!courses || courses.length === 0) {
    return;
  }
  let coursesID = {};
  courses.forEach((course) => {
    coursesID[course.name] = course.id;
  });
  return coursesID;
}

async function listCourseWork(auth, courseId) {
  const classroom = google.classroom({ version: 'v1', auth });
  const res = await classroom.courses.courseWork.list({
    courseId: courseId,
    pageSize: 0,
  });
  const courseWork = res.data.courseWork;
  if (!courseWork || courseWork.length === 0) {
    return;
  }
  let tasksID = {};
  courseWork.forEach((task) => {
    tasksID[task.title] = task.id;
  });
  return tasksID;
}

async function listStudentSubmissions(auth, courseId, courseWorkId, alumne) {
  const classroom = google.classroom({ version: 'v1', auth });
  const res = await classroom.courses.courseWork.studentSubmissions.list({
    courseId: courseId,
    courseWorkId: courseWorkId,
    pageSize: 0,
  });
  const submissions = res.data.studentSubmissions;
  if (!submissions || submissions.length === 0) {
    return;
  }
  if (alumne != '') {
    let alumneID = '';
    for (const submission of submissions) {
      const userId = submission.userId;
      const userProfile = await classroom.userProfiles.get({
        userId: userId,
      });
      const userProfileName = userProfile.data.name.fullName;
      if (userProfileName == alumne) {
        alumneID = userId;
      }
    }
    if (alumneID) {
      for (const submission of submissions) {
        const userId = submission.userId;
        if (userId == alumneID) {
          const grade = submission.assignedGrade ? submission.assignedGrade : 'No hi ha nota';
          const userProfile = await classroom.userProfiles.get({
            userId: userId,
          });
          const userProfileName = userProfile.data.name.fullName;
          return `Usuari: ${userProfileName}, Nota: ${grade}`;
        }
      }
    } else {
      return `No s'ha trobat l'alumne "${alumne}"`;
    }
  } else {
    let gradesList = 'Notes de la tasca:\n';
    for (const submission of submissions) {
      const userId = submission.userId;
      const grade = submission.assignedGrade ? submission.assignedGrade : 'No hi ha nota';
      const userProfile = await classroom.userProfiles.get({
        userId: userId,
      });
      const userProfileName = userProfile.data.name.fullName;
      gradesList += `• Usuari: ${userProfileName}, Nota: ${grade}\n`;
    }
    return gradesList;
  }
}