const multerS3 = require('multer-s3');
const express = require('express');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const Boom = require('boom');
const AWS = require('aws-sdk');

const { S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  endpoint: S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, {
        originalname: file.originalname,
      });
    },
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    key: (req, file, cb) => {
      const uuid = uuidv4();
      const key = `${req.s3_key_prefix}${uuid}`;

      req.saved_files.push({
        originalname: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding,
        key,
      });

      cb(null, key);
    },
  }),
});

const uploadAuth = (req, res, next) => {
  try {
    req.s3_key_prefix = req.headers['x-path'].replace(/^\/+/g, '');
  } catch(e) {
    return next(Boom.badImplementation('x-path header incorrect'));
  }

  req.saved_files = [];

  next();
}

router.post('/upload', uploadAuth, upload.array('files', 50), (req, res) => {
  res.json(req.saved_files);
});

module.exports = router;
