import base64
import threading
import requests
import settings
from telebot.types import InputMediaPhoto
from flask import Flask
from flask import render_template
from flask import request
from bot.bot import bot
from bot.models import SubmissionReviewMessage
from datetime import datetime, timezone


app = Flask(__name__,
            static_folder='static',
            template_folder='templates')


@app.route('/')
def hello_world():
    return render_template('drawing.html')


@app.route('/drawer/', methods=['GET', 'POST'])
def drawer():
    if request.method == 'GET':
        # file_id = request.args.get('file_id', None)
        chat_id = request.args.get('chat_id', None)
        message_id = request.args.get('message_id', None)
        submission_id = request.args.get('submission_id', None)

        # file_info = bot.get_file(file_id)
        # file_extension = file_info.file_path[file_info.file_path.index('.') + 1:]

        file_id = 'AgACAgIAAxkDAAIXll6wUcs3Rf8_IH3WNNRcJjHnlLcTAAK-rDEbXGiJSTcM3rvygL4Il_1tkS4AAwEAAwIAA3kAA77TAgABGQQ'
        file_extension = 'jpg'
        # response = requests.get('https://api.telegram.org/file/bot{0}/{1}'.format(settings.BOT_TOKEN, file_info.file_path))
        # with open('static/media/{0}.{1}'.format(file_id, file_extension), 'wb') as f:
        #     f.write(response.content)

        print(file_id, file_extension)
        return render_template('drawing.html',
                               file_id=file_id,
                               file_extension=file_extension,
                               chat_id=chat_id,
                               message_id=message_id,
                               submission_id=submission_id)

    if request.method == 'POST':
        data = request.values.to_dict()
        image_str = data.get('imgBase64', None)
        chat_id = data.get('chat_id', None)
        message_id = data.get('message_id', None)
        submission_id = data.get('submission_id', None)
        image_bytes = base64.b64decode(image_str[image_str.index(';base64,') + 8:])

        if message_id and submission_id:
            bot.edit_message_media(InputMediaPhoto(image_bytes), chat_id, message_id)
            SubmissionReviewMessage(submission_id, chat_id, message_id, created_utc=datetime.now(timezone.utc)).save()
        else:
            bot.send_photo(chat_id, image_bytes)

        return 'ok'


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    threading.Thread(target=app.run).start()
