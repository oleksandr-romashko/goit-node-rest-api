


# Contacts management application

#### goit-node-rest-api

<p align="center">
  <img align="center" src="./assets/thumbnail.jpg" width="720" title="Project thumbnail" alt="project thumbnail">
</p>


<h4 align="center">
  REST API application for managing your contacts.
</h4>


## Project description

Store and manage your contacts using a REST API.

* Supports the following routes:
  * `GET /api/contacts` - Returns an array of all contacts.
  * `GET /api/contacts/` - Returns the contact object by `id` or a JSON response in the format `{"message": "Not found"}` with a `404` status if the contact by id is not found.
  * `DELETE /api/contacts/` - Deletes the contact by `id`. Returns the object of the found and deleted contact in JSON format. If the contact by id is not found, returns a JSON response in the format `{"message": "Not found"}` with a `404` status.
  * `POST /api/contacts` - Returns the newly created contact object with fields `{id, name, email, phone}`.
  * `PUT /api/contacts/` - Returns the updated contact object. If the contact by `id` is not found, returns a JSON response in the format `{"message": "Not found"}` with a `404` status.

## Quickstart

1) Download the files from the [repository](https://github.com/oleksandr-romashko/goit-node-rest-api).
2) Make sure you have the [latest Node.js LTS version](https://nodejs.org/en/download/package-manager) installed on your machine. 
3) Install the application dependencies using the `npm install` command in your terminal.

## Usage

To start the web-server use `npm start` (for production) or `npm run dev` (for development with daemon) command in your terminal.

[Postman](https://www.postman.com/) application may be used to work and test REST API.