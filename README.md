# Firebase Custom Authentication Example
This repository contains an example implementation of using a custom authentication system with Firebase.

Powered by the [custom tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens) feature of Firebasse.

## Prerequisites
* [Go 1.22](https://go.dev/doc/install)
* [Node](https://nodejs.org/en/download)
* [Yarn](https://yarnpkg.com/getting-started/install)

## Usage
1. Start the server by running `go run main.go` from the server directory
2. Start the client by running `yarn install` followed by `yarn dev` from the client directory

## Components
The example consists of two components; server and client.

### Server
Implemented in Go, found in the [./server](./server) directory. The app exposes two RESTful endpoints:

* /login - Toy login endpoint that uses the Firebase SDK to issue a custom auth token. Accepts a JSON body of `{"email:"foo@bar.com", "password": "password"}`
* /private - Accepts an `Authorization` Bearer token and validates it using the Firebase SDK

### Client
Implemented in NextJS, found in the [./client](./client) directory.

A very simple web-application that shows a login form, submitting to the /login endpoint on the server. A valid login redirects to a page that calls the /private endpoint on the server. With a valid token the user ID should be displayed on the page.
