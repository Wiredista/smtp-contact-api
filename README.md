# SMTP Contact API

SMTP Contact API is a simple Elysia application that allows you to send contact form submissions using SMTP. It provides a basic form for users to fill out their name, email, and message, which is then sent to a specified email address.

## Getting Started
### Prerequisites
- [Bun](https://bun.sh/)

## Development
Create a `.env` file in the root directory of the project and add your SMTP configuration:

```sh
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=user@example.com
SMTP_PASS=123456

SMTP_FROM=user@example.com
SMTP_TO=noreply@example.com
SMTP_SUBJECT="Contact Form Submission"

NAME_CUSTOM_FIELD_1="Custom Field 1"
NAME_CUSTOM_FIELD_2="Custom Field 2"
NAME_CUSTOM_FIELD_3="Custom Field 3"
```

Then install the dependencies:
```bash
bun install
```

To run the application in development mode, use the following command:

```bash
bun run dev
```

Open http://localhost:3000/swagger in your browser to access the API documentation and test the endpoints.

## Production
To deploy the application in production mode, we recommend using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

Create a `.env` file in the root directory of the project and add your SMTP configuration (same as in development).

Then create a `docker-compose.yml` file in the root directory of the project with the following content:

```yaml
services:
  smtp-contact-api:
    build: https://github.com/Wiredista/smtp-contact-api.git
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: always
```

You may want to deploy the application using a reverse proxy like Nginx or Traefik to handle SSL termination and routing.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.