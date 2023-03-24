const { SlashCommandBuilder } = require('discord.js');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cursos')
    .setDescription('Llista els cursos'),
  async execute(interaction) {
    try {
      const auth = await authorize();
      let courseList = await listCourses(auth);
      interaction.reply({ content: courseList, ephemeral: true });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Ocurrió un error al obtener los cursos de Google Classroom.', ephemeral: true });
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
 * Lists the courses the user has access to.
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

  let courseList = 'Cursos disponibles en Classroom:\n';
  courses.forEach((course) => {
    courseList += `• ${course.name}\n`;
  });
  return courseList;
}