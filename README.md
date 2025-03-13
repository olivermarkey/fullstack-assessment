# Full-Stack Application Assessment

This repo contains a full-stack web app built with the following technologies:

* **React Router V7 (Framework Mode)** - Uses client side routing and LOADERS and ACTIONS for data fetching and mutations. Framework mode comes with vite installed for bundling and transpiling.
* **Mantine** - A front end component library which uses postcss for styling.
* **Docker** - Used to containerize both the react application and the postgres database for deployment.
* **PostgreSQL** - A containerized database with schema and seeding. Note: The current postgres scripts do not save a volume locally.
* **PostgREST** - API layer for PostgreSQL.
* **AWS Cognito** - Authentication service.
* **AG Grid** - Data grid component.

## System Architecture

This fullstack application is designed to follow a MVC architecture, where the views are handled by React Router, and the express server is used to handle the business and data logic (Models and Controllers). This structure allows for a separation of concerns and a more modular design.

At this point the functions of the controllers and models are somewhat abitrary, but they are easily extendable and can be used to handle more complex business logic.

The below diagram shows the relationship between the different components of the system. In production, 4 docker containers are used: 1 for the postgres database, 1 for the postgrest api, 1 for the express server, and 1 for the react application.

```mermaid
flowchart LR
    subgraph Database
    A[(Postgres Docker Image)] <--> B(PostgREST)
    end
    subgraph Express Server
    B <--> C(Data Models)
    C <--> D(Controllers)
    D <--> F(Express Router)
    end
    subgraph React Router
    F <--> G(React Router App)
    end
```

## Development

To run the application in development mode, run the following command:

*This is missing the docker compose file for the postgres database and postgrest api.*
```bash
npm install
npm run dev
```

This will start the react application in development mode and the express server in development mode.

## Production

To run the application in production mode, run the following command:

```bash
npm install
npm run build
npm run start
```


## Callouts

* Currently there is no testing
* Key features such as forgot pw are not implemented as they are out of scope.

