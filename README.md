# Paidagogos Drawer

Paidagogos Drawer provides the review interface for teachers in [Paidagogos Bot](https://github.com/Macket/paidagogos_bot).

## Getting Started

Paidagogos bot requires Python 3.7 and packages specified in ```requirements.txt```.

You can install them with

```
pip install -r requirements.txt
```

Before you start Paidagogos it is necessary to create ```.env``` file:

```
touch .env
```

and fill in this file according to the example below:

```
DEBUG = True

BOT_TOKEN = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ADMIN_ID = XXXXXXXXXXX

DATABASE_URL = postgres://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

DB_NAME = paidagogos_db
DB_USER = user
DB_PASSWORD = XXXXXXXXXXX
DB_HOST = localhost

PROXY = https://XXX.XXX.XXX.XXX:XXXX

```

**ATTENTION!!!** ```BOT_TOKEN```, ```DATABASE_URL```, ```DB_NAME```, ```DB_USER```, ```DB_PASSWORD``` and  ```DB_HOST``` must be the same as used for [Paidagogos Bot](https://github.com/Macket/paidagogos_bot)

```DEBUG``` should be **False** in prod

```ADMIN_ID``` is the telegram id of the admin

```PROXY``` is used if Telegram is blocked in your country (also uncomment appropriate code in ***bot.py***)


Then you can start Paidagogos bot with this command:

```
python app.py
```

## DEMO


![check](https://raw.githubusercontent.com/Macket/paidagogos_drawer/master/videos/readme/demo.gif)