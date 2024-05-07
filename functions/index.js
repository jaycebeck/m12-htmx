/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const pug = require("pug");
const admin = require("firebase-admin");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.home = onRequest({ cors: true },(request, response) => {
    let template = pug.compileFile("views/home.pug");
    let html = template({title: "Home"});
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(html);
});

exports.calendar = onRequest({ cors: true },(req, res) => {
    const { month, year } = req.query;

    // Generate calendar HTML using Pug template
    const compiledFunction = pug.compileFile("views/calendar.pug");
    const calendarHtml = compiledFunction({ month, year });

    // Send calendar HTML as response
    res.send(calendarHtml);
});

exports.tasks = onRequest({ cors: true },(req, res) => {

    // Generate tasks HTML using Pug template
    const compiledFunction = pug.compileFile("views/tasks.pug");
    const tasksHtml = compiledFunction({ tasks });

    // Send tasks HTML as response
    res.send(tasksHtml);
});

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Access the Firebase database
const db = admin.firestore();

// Your code to interact with the database goes here
exports.addTask = onRequest({ cors: true },async (req, res) => {
    const { title, description, dueDate } = req.body;

    // Add task to the database
    await db.collection("tasks").add({ title, description, dueDate });

    // Send success response
    res.send("<div></div>");
});

exports.addTaskForm = onRequest({ cors: true },(req, res) => {
    // Generate add task form HTML using Pug template
    const compiledFunction = pug.compileFile("views/addTask.pug");
    const addTaskFormHtml = compiledFunction();

    // Send add task form HTML as response
    res.send(addTaskFormHtml);
});

exports.getTaskDates = onRequest({ cors: true },async (req, res) => {
    const snapshot = await db.collection("tasks").get();
    const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
    });

    // Get the due dates of all tasks
    const taskDates = tasks.map(task => task.dueDate);

    // Send task dates as response
    res.send(taskDates);
});

exports.getTasks = onRequest({ cors: true },async (req, res) => {
    const snapshot = await db.collection("tasks").get();
    const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
    });

    // Generate tasks HTML using Pug template
    const compiledFunction = pug.compileFile("views/tasks.pug");
    const tasksHtml = compiledFunction({ tasks });

    // Send tasks HTML as response
    res.send(tasksHtml);
});

exports.editTaskForm = onRequest({ cors: true },async (req, res) => {
    const { id } = req.query;

    // Get task from the database
    const doc = await db.collection("tasks").doc(id).get();
    const task = doc.data();

    // Generate edit task form HTML using Pug template
    const compiledFunction = pug.compileFile("views/editTask.pug");
    const editTaskFormHtml = compiledFunction({ id, task });

    // Send edit task form HTML as response
    res.send(editTaskFormHtml);
});

exports.updateTask = onRequest({ cors: true },async (req, res) => {
    const { id, title, description, dueDate } = req.body;

    // Update task in the database
    await db.collection("tasks").doc(id).update({ title, description, dueDate });

    // Send success response
    res.send("<div></div>");
});

exports.deleteTask = onRequest({ cors: true },async (req, res) => {
    const { id } = req.query;

    // Delete task from the database
    await db.collection("tasks").doc(id).delete();

    // Send success response
    res.send("Task deleted successfully!");
});

exports.blankDiv = onRequest({ cors: true },(req, res) => {
    res.send("<div></div>");
});