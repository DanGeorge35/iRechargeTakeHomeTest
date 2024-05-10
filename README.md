# iRechargeTakeHomeTest API

The documentation for the iRechargeTakeHomeTest API.

## Requirements:

#### QUESTION TWO: API Development:

You are to develop a small containerized service with an HTTP API using a framework of
your choice. The system allows end users to purchase CABLE TV by allowing them to view a
list of available providers and their packages. The intended API can be interfaced via HTTP
and should provide the following endpoints:
● /auth
● GET /users
● GET /providers
● GET /providers/{slug}/packages
Packages are provided as JSON files in the attached zip and need to be imported into the
service once. The API should offer some basic authentication to authenticate a specific
user at the ‘/auth’ endpoint. After a user is authenticated, the user should see user data
at the `/users` endpoint, the providers at /providers (returns slug: unique provider
identifier + name), and the /providers/{slug}/packages return the packages of a
provider.

## Implementation

\*\*Please note

1. To run this project you will need Docker installed on your machine.
2. The API does not include any form of payment processing or actual
   purchase functionality. It only provides information about what products are available and how
   to access it.

## Running the Application Locally

## Documentation

The documentation for all endpoints implemented for the iRechargeTakeHomeTest API can be found [here](https://documenter.getpostman.com/view/10671823/2sA3JM6gEWhttps://documenter.getpostman.com/view/10671823/2sA3JM6gEW).

## Technologies

iRechargeTakeHomeTest API is built using:

- NodeJS (TypeScript) v20.10.0
- MySQL (Sequelise ORM)
- Express Web Framework
- NPM

## Endpoints

### Auth Endpoint

- **Path**: `/auth`
- **Method**: `POST`
- **Description**: This endpoint is used for user authentication, allowing users to log in.
- **Handler**: UsersController.Login

### Create User Endpoint

- **Path**: `${ENDPOINT_URL}/`
- **Method**: `POST`
- **Description**: Create a new user account.
- **Handler**: UsersController.createUser

### Update User Endpoint

- **Path**: `${ENDPOINT_URL}/:id`
- **Method**: `PATCH`
- **Description**: Updates an existing user's information.
- **Handler**: Authorization, UsersController.updateUser

### Change Password Endpoint

- **Path**: `${ENDPOINT_URL}/changepassword`
- **Method**: `PUT`
- **Description**: Allows users to change their password.
- **Handler**: Authorization, UsersController.changePassword

### Get All Users Endpoint

- **Path**: `${ENDPOINT_URL}/`
- **Method**: `GET`
- **Description**: Retrieves a list of all users.
- **Handler**: Authorization, UsersController.getAllUsers

### Get Single User Endpoint

- **Path**: `${ENDPOINT_URL}/:id`
- **Method**: `GET`
- **Description**: Retrieves information about a specific user.
- **Handler**: UsersController.getSingleUser

## Deployment

### Docker Deployment

#### Prerequisites

- Docker installed on your machine.

#### Steps

Clone the repository to your local machine.

```bash
git clone <repository-url>
cd <project-directory>
docker build -t <image-name> .
docker run -d -p <host-port>:<container-port> --name <container-name> <image-name>
```

http://localhost:<host-port>

### Prerequisites

- Node v16.x
- Yarn v3.x

To continue/contribute to the development of the iRechargeTakeHomeTest API, clone this repository and execute the following commands in your terminal or command prompt, inside the cloned project folder:

- `yarn install`
- `yarn dev`

### Code Editor/IDE

This project is managed using Yarn v3 (https://yarnpkg.com/features) which means you do not need a `node_modules` folder. Also, if you are using the Visual Studio Code editor or other editor/IDE, follow this instructions to enable Yarn PnP features: https://yarnpkg.com/getting-started/editor-sdks

### Contributions

cc: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

In order to refactor, implement a new feature or fix a bug:

- Create a new branch with any of the following prefixes (`feat`, `fix`, `chore`, `test` or `refactor`) e.g. `feat/crazy-idea`

- Write your awesome code including tests

- Commit your changes and create a PR to the `test` branch

- A review application will be spawned from your PR for further testing as well trigger a CI pipeline to run the automated tests

- If all goes well, your PR is merged and you're good to go!

## Tests

To execute the test suite, run the following command in your terminal or command prompt:

- `yarn test`

```

```
