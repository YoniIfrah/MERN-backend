/**
* @swagger
* tags:
*   name: Student
*   description: The Student API
*/

import express from 'express'
import student from '../controllers/student'
const router = express.Router()

/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - id
*         - email
*         - name
*         - avatarUrl
*       properties:
*         id:
*           type: string
*           description: The student id
*         name:
*           type: string
*           description: The student name
*         avatarUrl:
*           type: string
*           description: The student avatar url
*       example:
*         id: '123'
*         email: "oren@gmail.com"
*         name: 'Oren'
*         avatarUrl: 'www.mysute/oren.jpg'
*     StudentPut:
*       type: object
*       required:
*         - text
*       properties:
*         text:
*           type: string
*           description: The student name
*       example:
*         image: 'NEW'
*     StudentPut2:
*       type: object
*       required:
*         - image
*       properties:
*         image:
*           type: string
*           description: The student photo
*       example:
*         image: 'NEW2'
*/

/**
 * @swagger
 * /student:
 *   get:
 *     summary: get list of post from server
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Student'
 *  
 */
router.get('/', student.getAllStudents)

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: get student by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *  
 */
router.get('/:id', student.getStudentById)

/**
 * @swagger
 * /student:
 *   post:
 *     summary: add a new post
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: the requested student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *  
 */
router.post('/', student.addNewStudent)

/**
 * @swagger
 * /student/email/{email}:
 *   get:
 *     summary: get student by email
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the return body 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *  
 */
router.get('/email/:email', student.getStudentsByEmail)

/**
 * @swagger
 * /student/delete/{id}:
 *   delete:
 *     summary: delete student by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the return body 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *  
 */
router.delete('/delete/:id', student.deleteById)


/**
 * @swagger
 * /student/update/{id}:
 *   put:
 *     summary: update student by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentPut'
 *     responses:
 *       200:
 *         description: the requested student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentPut'
 *  
 */
router.put('/update/:id', student.putById)

/**
 * @swagger
 * /student/updatedImg/{id}:
 *   put:
 *     summary: update student by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentPut2'
 *     responses:
 *       200:
 *         description: the requested student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentPut2'
 *  
 */
router.put("/updatedImg/:id", student.updatedImg)




export = router