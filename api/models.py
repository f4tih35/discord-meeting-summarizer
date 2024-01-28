from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Entity(db.Model):
    __tablename__ = 'entities'
    id = db.Column(db.Integer, primary_key=True)
    pcms_file_path = db.Column(db.String)
    wav_file_path = db.Column(db.String)
    text_file_path = db.Column(db.String)
