const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection')
const bcrypt = require('bcrypt')
const saltRounds = 10

class User extends Model {
  async checkPassword(plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password)
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8]
      }
    }
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async function (user) {
        user.password = await bcrypt.hash(user.password, saltRounds)
      },
      beforeUpdate: async function (user) {
        user.password = await bcrypt.hash(user.password, saltRounds)
      },
    // don't automatically create timestamp fields
    timestamps: false,
    // don't plurallize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing
    underscored: true,
    // make it so our model name stays in lowercase in the database
    modelName: 'user'
    }
  })

module.exports = User