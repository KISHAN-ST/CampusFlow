# CampusFlow API Contract

## Base URL

/api

---

## Student

POST /student

GET /students

GET /student/:id

Payload

```json
{
  "name": "",
  "branch": "",
  "year": "",
  "subjects": [],
  "phone": "",
  "gmail": ""
}
```

---

## Task

POST /task

GET /tasks

PUT /task/:id

DELETE /task/:id

Payload

```json
{
  "title": "",
  "subject": "",
  "description": "",
  "deadline": "",
  "reminderTime": "",
  "calendar": true,
  "studentId": ""
}
```

---

## Notice

POST /notice

Payload

```json
{
  "title": "",
  "content": ""
}
```

Response

```json
{
  "summary": ""
}
```
