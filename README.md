# 📬 SMTP Contact API 

SMTP Contact API is a small Elysia application that sends contact form submissions via SMTP. It provides an endpoint to receive name, email, phone and message fields, then forwards the submission to a configured email address.

## 🚀 Getting Started 
### Prerequisites
- [Bun](https://bun.sh/)

## 🛠️ Development 
Create a `.env` file in the project root and add your SMTP configuration:

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

TEMPLATE=default
```

Install dependencies:

```bash
bun install
```

Run the application in development mode:

```bash
bun run dev
```

Open http://localhost:3000/swagger to access the API documentation and test the endpoints.

## 📄 Templates 
Templates are plain HTML files placed in the `templates/` folder at the project root. The server loads the template specified by the `TEMPLATE` environment variable (for example `TEMPLATE=default` will use `templates/default.html`).

Guidelines:
- Create a `templates` directory in the project root and add your HTML template files (e.g. `default.html`).
- Templates use placeholder variables that are replaced when sending the email.
- For best compatibility with email clients (Gmail, Outlook, etc.), use table-based layouts and inline styles. Avoid CSS variables and modern layout features like flexbox.

Available template variables:
- `{{origin}}` — origin of the submission
- `{{name}}`
- `{{email}}`
- `{{phone}}`
- `{{message}}`
- `{{customField1Name}}`, `{{customField1}}`
- `{{customField2Name}}`, `{{customField2}}`
- `{{customField3Name}}`, `{{customField3}}`

Example template path:

```
templates/default.html
```

Docker users: to override templates from the host, mount the `templates` folder into the container. Example (commented) docker-compose snippet:

```yaml
services:
  smtp-contact-api:
    build: https://github.com/Wiredista/smtp-contact-api.git
    ports:
      - "3000:3000"
    env_file:
      - .env
    # Uncomment to mount local templates into the container and override built-in templates
    # volumes:
    #   - ./templates:/app/templates
    restart: always
```

## 📦 Production 
To deploy in production, consider using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

Create a `.env` file in the project root with your SMTP configuration (same as in development).

A minimal `docker-compose.yml` example:

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

Use a reverse proxy (Nginx, Traefik) for SSL termination and routing when appropriate.

## ⚖️ License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.