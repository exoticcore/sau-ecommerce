import { Request, Response } from 'express';
import UserService from './user-service';
import { SignupUserDTO } from './user-dto';
import argon from 'argon2';
import { AccessPayload } from '../../utils/jwt-token';

const userService = new UserService();

export default class UserController {
  async signupUser(req: Request, res: Response) {
    const userInfo: SignupUserDTO = req.body;
    const accessToken: AccessPayload = res.locals.accessToken;

    console.log(accessToken);

    try {
      const user = await userService.getUserByID(accessToken.id);
      if (!user) {
        return res.status(400).json({ message: 'bad request error' });
      }

      await userService.addInfo(user.email, userInfo);
      return res.status(200).json({ message: 'user info has been added' });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      res.status(500).json({ message: 'internal server error' });
    }
  }

  async setPassword(req: Request, res: Response) {
    const { password } = req.body;
    const accessToken: AccessPayload = res.locals.accessToken;

    try {
      const user = await userService.getUserByID(accessToken.id);
      if (!user || user.password) {
        return res.status(400).json({ message: 'bad request error' });
      }
      const hashed = await argon.hash(password);
      await userService.setPassword(user.email, hashed);

      return res.status(200).json({ message: 'set password successfuly' });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }

      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async getUserInfo(req: Request, res: Response) {
    const accessToken: AccessPayload = res.locals.accessToken;

    try {
      const user = await userService.getUserByID(accessToken.id);
      if (!user) {
        return res.status(404).json({ message: 'user not found' });
      }

      if (!user.givenName) {
        return res
          .status(204)
          .json({ message: 'please privide user information' });
      }

      return res.status(200).json({
        email: user.email,
        given_name: user.givenName,
        first_name: user.firstName,
        last_name: user.lastName,
        picture: user.picture,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }

      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async updateUserInfo(req: Request, res: Response) {}
}
