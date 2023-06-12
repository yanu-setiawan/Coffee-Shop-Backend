<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="./public/logo123.svg" alt="Logo" width="80" height="80">
  </a>

  <h2 align="center">Coffee Shop</h2>

  <p align="center">
    <a href="https://documenter.getpostman.com/view/26100678/2s93m62Mkp">Postman Documentation</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

## Built With

<!-- <p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,postgres,vercel,mongo" />
  </a>
</p> -->
*   [NodeJS](https://nodejs.org/)
*   [ExpressJS](https://expressjs.com/)
*   [Postgresql](https://www.postgresql.org/)
*   [MongoDB](https://www.mongodb.com)
*   [JWT](https://github.com/auth0/node-jsonwebtoken)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 𓆙 Table of Contents


- [Table of Contents](#𓆙-Table-of-Contents)
- [Requirement](#𓆙-Requirement)
- [Installation](#)
  - [Windows](#𓆙-Windows-Installation)
  - [Linux](#𓆙_Linux_Installation)
- [How to run](#𓆙-How-to-run)
- [Related Projects](#𓆙-Related-Projects)
- [Route](#𓆙-Documentation-Postman)
- [Documentation Postman](#𓆙-Documentation-Postman)

## 𓆙 Requirement

This repo require a [NodeJS](https://nodejs.org/)

[ENV](#ENV) File

## 𓆙 Windows Installation

First of all, you need to install [Git](https://git-scm.com/download/win) & [NodeJS](https://nodejs.org/). Then open your git bash, and follow this:<br>

```sh
$ git clone https://github.com/yanu-setiawan/Coffee-Shop-Backend.git
$ cd Coffee-Shop
```

## 𓆙 Linux Installation

```sh
$ apt-get update
$ apt-get install git-all
$ apt-get install nodejs-current
$ git clone https://github.com/yanu-setiawan/Coffee-Shop-Backend.git
$ cd Coffee Shop
```

## 𓆙 How to run

1. Install file using [WINDOWS](#Windows-Installation) OR [LINUX](Linux-Installation)

2. Add .env file at root folder, and add following

```sh
DB_HOST = "YOUR HOST"
DB_DATABASE = "YOUR DB NAME"
DB_PORT = "YOUR DB PORT"
DB_USER = "YOUR DB USER"
DB_PWD = "YOUR DB PASSWORD"
SERVER_PORT = "YOUR LOCALHOST"

JWT_SECRET = "YOUR SECRET JWT"

MONGO_PWD = "YOUR MONGO PASSWORD"
MONGO_DBNAME = "YOUR DB NAME"
MONGO_USER = "YOUR USERNAME MONGO"
MONGO_HOST = "YOUR MONGO HOST"

CLOUD_NAME = "YOUR CLOUDNAME"
CLOUD_KEY = "YOUR KEY CLOUD"
CLOUD_SECRET = "YOUR KEY SECRET CLOUD "

```

3. Starting application

```sh
$ npm run dev
```

## Related Projects

[Coffee-Shop Website](https://github.com/yanu-setiawan/Coffee-Shop-React-App)

[Coffee-Shop Mobile](https://github.com/yanu-setiawan/Coffee-Shop-Mobile)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 𓆙 Route

| Endpoint                       |      Method      | Info         | Remark                                |
| ----------------------------   | :--------------: | :----------- | :------------------------------------ |
| /api/auth                      |      `POST`      | Auth         | Login                                 |
| /api/auth/logout               |      `DELETE`    | Auth         | LogoutT                                |
| /api/users                     |      `GET`       | User         | Get Users (admin)                     |
| /api/users                     |      `POST`      | Auth         | Register                              |
| /api/users/editPWD/:id         |      `POST`      | User         | Change Password                       |
| /api/users/profile/:id         |     `PATCH`      | User         | Change Profile                        |
| /api/transactions/get-all-order|      `GET`       | Transactions | History transactios all users( admin) |
| /api/transactions              |      `GET`       | Transactions | History Transaction                   |
| /api/transactions/             |      `POST`      | Transactions | Create Transaction                    |
| /api/transactions/:id          |     `DELETE`     | Transactions | Delete Transaction (admin)            |
| /api/products                  |   `POST` `GET`   | Products     | Create and See Products               |
| /api/products/:id              | `PATCH` `DELETE` | Products     | Delete and Edit Products              |
| /api/products/favorite         |      `GET`       | Products     | Products favorite                     |
| /api/promo                     |      `GET`       | Promo        | Detail Promo                          |
| /api/promo/                    |      `POST`      | Promo        | Add Promo                             |
| /api/promo/:id                 |      `PATCH`     | Promo        | Edit Promo                            |
| /api/promo/:id                 |     `DELETE`     | Promo        | Delete Promo                          |

## 𓆙 Documentation Postman

Click here [POSTMAN](https://documenter.getpostman.com/view/26100678/2s93m62Mkp)

<BR>
<BR>

<p align="center"> <samp><i>&copy; yanusetiawan </i></samp> </p>
