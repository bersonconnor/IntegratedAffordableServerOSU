// import { Request, Response } from "express";
// import { mock } from "jest-mock-extended";
// import { AuthenticationService } from "../../services/AuthenticationService";
// require("dotenv").config();
// import { UserInfo, UserType } from "affordable-shared-models";
// const mockAuthSvc = mock<AuthenticationService>();
// const userInfo: UserInfo = {
//     id: 4,
//     username: "anyone",
//     hasVerifiedEmail: true,
//     userType: UserType.DONOR
// };
// // Mock just the verify function from jsonwebtoken
// jest.unmock("jsonwebtoken");
// import jwtModule from "jsonwebtoken";
// import { AuthenticationController } from "../AuthenticationController";
// let mockResponse;
// let authenticationController: AuthenticationController;
// describe("verifyUser tests to check an authorization token", () => {
//     beforeAll(() => {
//         authenticationController = new AuthenticationController(mockAuthSvc);
//     });
//     beforeEach(() => {
//         mockResponse = mock<Response>();
//         jwtModule.verify = jest.fn().mockImplementation(
//             (token, key, callback) => {
//                 // check that the token is valid
//                 callback(null, { sub: JSON.stringify(userInfo) });
//             });
//     });
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//     test("Token is defined", () => {
//         mockAuthSvc.refreshToken.mockImplementation(() => {
//             return Promise.resolve({
//                 token: "token",
//                 userInfo: userInfo
//             });
//         });
//         const req = { headers: { "authorization": "Bearer token" } } as Partial<Request>;
//         const next = () => { };
//         // Call under test
//         authenticationController.verifyUser(req, mockResponse, next);
//         expect(mockResponse.locals.userInfo).toEqual(userInfo);
//         expect(mockAuthSvc.refreshToken).toBeCalledTimes(1);
//     });
//     test("Bearer header is undefined", () => {
//         const req = { headers: {} } as Partial<Request>;
//         const next = () => { };
//         // Call under test
//         authenticationController.verifyUser(req, mockResponse, next);
//         expect(mockResponse.locals.userInfo).toBeUndefined();
//         expect(mockAuthSvc.refreshToken).toBeCalledTimes(0);
//     });
//     test("Test failed token verification", () => {
//         jwtModule.verify = jest.fn().mockImplementation(
//             (token, key, callback) => {
//                 // check that the token is valid
//                 callback(true, { sub: JSON.stringify(userInfo) });
//             });
//         const req = { headers: {} } as Partial<Request>;
//         const next = () => { };
//         // Call under test
//         authenticationController.verifyUser(req, mockResponse, next);
//         expect(mockResponse.locals.userInfo).toBeUndefined();
//         expect(mockAuthSvc.refreshToken).toBeCalledTimes(0);
//     });
// });
