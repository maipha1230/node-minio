const { UserModel } = require("../database/index");
const config = require("../config/index");
const minio = require("../utils/minio");
const { v4: uuidv4 } = require("uuid");

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */
module.exports.CreateUser = async function (req, res) {
  try {
    const { username } = req.body
    const file = req.file
    
    if (!username || typeof username !== 'string' || !file) {
        return res.status(200).json({ message: "the_parameter_incorrect" })
    }

    const userExist = await UserModel.findOne({
        where: {
            username: username.toLowerCase()
        }
    })
    if (userExist) {
        return res.status(400).json({ message: "user.already_exist" })
    }

    const imageId = uuidv4();
    const objectName = `${imageId}-${file.originalname}`;

    const existBucket = await minio.CheckBucketExist(config.minio.bucketName);
    if (!existBucket?.status) {
        return res.status({ message: "user_bucket.not_exist" })
    }

    const uploadOBS = await minio.PutObject(config.minio.bucketName, objectName, file.buffer, file.mimetype)
    if (!uploadOBS?.status) {
        return res.status(400).json({ message: "upload.fail" })
    }

    const user = {
        username: username.toLowerCase(),
        imageObjectName: objectName,
        imageOriginalName: file.originalname
    }

    const create = await UserModel.create(user)
    if (!create) {
        return res.status(400).json({ message: "user.create.fail" })
    }
    
    return res.status(200).json({message: "user.create.success", data: create});
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "internal_server_error" });
  }
};

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */
module.exports.GetUserInformation = async function (req, res) {
    try {
      const { username } = req.params
  
      if (!username || typeof username !== 'string') {
          return res.status(200).json({ message: "the_parameter_incorrect" })
      }
  
      const userExist = await UserModel.findOne({
          where: {
              username: username.toLowerCase()
          }
      })
      if (!userExist) {
          return res.status(400).json({ message: "user.found" })
      }
      
      return res.status(200).json(userExist);
    } catch (error) {
      return res.status(500).json({ message: "internal_server_error" });
    }
  };

  /**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */
module.exports.GetImage = async function (req, res) {
    try {
      const { image } = req.params
  
      if (!image || typeof image !== 'string') {
          return res.status(200).json({ message: "the_parameter_incorrect" })
      }
  
      const existBucket = await minio.CheckBucketExist(config.minio.bucketName);
      if (!existBucket?.status) {
          return res.status({ message: "user_bucket.not_exist" })
      }

      const {status, data: dataSteam} = await minio.GetObject(config.minio.bucketName, image)
      if (!status) {
        return res.status(404).json({ message: "image.not_found" })
      }

      dataSteam.on("data", function (data) {
        return res.status(200).write(data);
      });
      dataSteam.on("error", function (err) {
        return res.status(404).send({ message: "cannot_download_image" });
      });
  
      dataSteam.on("end", () => {
        return res.end();
      });
    } catch (error) {
      return res.status(500).json({ message: "internal_server_error" });
    }
  };
