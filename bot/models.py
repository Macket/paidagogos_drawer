import abc
from bot.db_scripts import execute_database_command


class SubmissionReviewMessage:
    def __init__(self, submission_id, teacher_id, message_id, created_utc=None, id=None):
        self.submission_id = submission_id
        self.teacher_id = teacher_id
        self.message_id = message_id
        self.created_utc = created_utc
        self.id = id

    @abc.abstractmethod
    def get(submission_message_id):
        try:
            id, teacher_id, submission_id, message_id, created_utc = execute_database_command('SELECT * FROM submission_review_messages WHERE id=%s', (submission_message_id, ))[0][0]
            return SubmissionReviewMessage(submission_id, teacher_id, message_id, created_utc, id)
        except IndexError:
            return None

    def save(self):
        if SubmissionReviewMessage.get(self.id):
            execute_database_command(
                'UPDATE submission_review_messages SET '
                'submission_id = %s, '
                'teacher_id = %s, '
                'message_id = %s, '
                f'''created_utc = '{self.created_utc}' '''
                'WHERE id = %s',
                (self.submission_id, self.teacher_id, self.message_id, self.id)
            )
        else:
            submission_message_id = execute_database_command(
                'INSERT INTO submission_review_messages (submission_id, teacher_id, message_id, created_utc) '
                f'''VALUES (%s, %s, %s, '{self.created_utc}') RETURNING id''',
                (self.submission_id, self.teacher_id, self.message_id)
            )[0][0][0]
            return SubmissionReviewMessage(self.submission_id, self.teacher_id, self.message_id, self.created_utc, submission_message_id)

    def __str__(self):
        return f'Submission: {self.submission_id} (Message: {self.message_id})'
