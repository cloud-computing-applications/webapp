const assert = require('assert');

const dummyUserObject = {
    username: "dummyUser@gmail.com",
    password: "password",
    first_name: "dummy",
    last_name: "user"
}

let dummyUserObject_Basic_Token = Buffer.from(`${dummyUserObject.username}:${dummyUserObject.password}`, 'utf8').toString('base64');

const dummyUserObject_2_Missing_Field = { // missing fields
    username: "dummyUser2@gmail.com",
    password: "password"
}

const dummyUserObject_2_Missing_Value = { // empty field
    username: "dummyUser@gmail.com",
    password: "password",
    first_name: "",
    last_name: "user"
}

const dummyUserObject_3_InvalidUsername = {
    username: "dummyUser3",
    password: "password",
    first_name: "dummy",
    last_name: "user"
}

const dummyUserObject_4 = {
    username: "dummyUser4@gmail.com",
    password: "password",
    first_name: "dummy",
    last_name: "user"
}

const dummyUserObject_4_Basic_Token = Buffer.from(`${dummyUserObject_4.username}:${dummyUserObject_4.password}`, 'utf8').toString('base64');

const dummyUserObject_5_Untrimmed = {
    username: "  dummyUser5@gmail.com   ",
    password: "password",
    first_name: "dummy   ",
    last_name: "   user"
}

const dummyUserCombinationTest = {
    username: "test@gmail.com",
    password: "test",
    first_name: "test",
    last_name: "user"
}

let dummyUserCombinationTest_Basic_Token = Buffer.from(`${dummyUserCombinationTest.username}:${dummyUserCombinationTest.password}`, 'utf8').toString('base64');


describe('User Endpoints', async () => {
    describe('Create User', async() => {
        it('New User with valid Payload should get 201 response code with valid response body', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject)
            });
            assert.equal(res.status, 201);

            const data = await res.json();

            assert.equal(data.username, dummyUserObject.username);
            assert.equal(data.first_name, dummyUserObject.first_name);
            assert.equal(data.last_name, dummyUserObject.last_name);
            assert.equal(data.password, undefined);
            assert.notEqual(data.account_created, undefined);
            assert.notEqual(data.account_updated, undefined);
        });

        it('New User with valid Payload and untrimmed field should get 201 response code with trimmed response body', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject_5_Untrimmed)
            });
            assert.equal(res.status, 201);

            const data = await res.json();

            assert.notEqual(data.id, undefined);
            assert.equal(data.username, dummyUserObject_5_Untrimmed.username.trim());
            assert.equal(data.first_name, dummyUserObject_5_Untrimmed.first_name.trim());
            assert.equal(data.last_name, dummyUserObject_5_Untrimmed.last_name.trim());
            assert.equal(data.password, undefined);
            assert.notEqual(data.account_created, undefined);
            assert.notEqual(data.account_updated, undefined);
        });

        it('New User with missing Payload fields should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject_2_Missing_Field)
            });
            assert.equal(res.status, 400);
        })

        it('New User with missing Payload value should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject_2_Missing_Value)
            });
            assert.equal(res.status, 400);
        })

        it('Existing user should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject)
            });
            assert.equal(res.status, 400);
        })

        it('New user with Invalid username should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject_3_InvalidUsername)
            });
            assert.equal(res.status, 400);
        })

        it('New user with query parameters should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user?test=123`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject_4)
            });
            assert.equal(res.status, 400);
        })

        it('New user with wrong method should get 405 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserObject_4)
            });
            assert.equal(res.status, 405);
        })
    })

    describe("Get User", async () => {
        it('Existing User should get 200 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
            });
            assert.equal(res.status, 200);

            const data = await res.json();

            assert.equal(data.username, dummyUserObject.username);
            assert.equal(data.first_name, dummyUserObject.first_name);
            assert.equal(data.last_name, dummyUserObject.last_name);
            assert.equal(data.password, undefined);
            assert.notEqual(data.account_created, undefined);
            assert.notEqual(data.account_updated, undefined);
        })

        it('Non Existing User should get 401 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_4_Basic_Token}`
                },
            });
            assert.equal(res.status, 401);
        })

        it('Get User with query parameters should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self?test=123`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
            });
            assert.equal(res.status, 400);
        })
    })

    describe("Update User", async () => {
        it("Update Existing User should get 204 response code", async () => {
            const newPassword = "password_new";
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: "dummy new",
                    last_name: "user new",
                    password: newPassword
                })
            });

            assert.equal(res.status, 204);
            dummyUserObject_Basic_Token = Buffer.from(`${dummyUserObject.username}:${newPassword}`, 'utf8').toString('base64');
        })

        it("Update Existing User with a subset of valid fields should get 204 response code", async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: "dummy new subset",
                })
            });

            assert.equal(res.status, 204);
        })

        it("Update Existing User with invalid fields should get 400 response code", async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: "dummy new invalid",
                    account_created: new Date()
                })
            });

            assert.equal(res.status, 400);
        })

        it("Update Existing User with query parameters should get 400 response code", async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self?test=123`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: "dummy new query",
                })
            });

            assert.equal(res.status, 400);
        })

        it("Update Non Existing User should get 401 response code", async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_4_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: "dummy new",
                    last_name: "user new",
                })
            });

            assert.equal(res.status, 401);
        })

        it("Update Existing User with wrong method should get 405 response code", async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "OPTIONS",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: "dummy new method",
                })
            });

            assert.equal(res.status, 405);
        })

        it("Update Existing User with untrimmed field should get 204 response code with fields set as trimmed", async () => {
            const newFirstName = "       dummy new method    ";
            const res = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: newFirstName,
                })
            });

            assert.equal(res.status, 204);

            const resUserData = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserObject_Basic_Token}`
                }
            });

            assert.equal(resUserData.status, 200);

            const data = await resUserData.json();

            assert.equal(data.first_name, newFirstName.trim());
        })
    })

    describe("Combination Test", async () => {
        it('Create an account, and using the GET call, validate account exists', async () => {
            const createUserRes = await fetch(`http://localhost:${process.env.PORT}/v1/user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dummyUserCombinationTest)
            });
            assert.equal(createUserRes.status, 201);

            const createUserData = await createUserRes.json();

            assert.notEqual(createUserData.id, undefined);
            assert.equal(createUserData.username, dummyUserCombinationTest.username);
            assert.equal(createUserData.first_name, dummyUserCombinationTest.first_name);
            assert.equal(createUserData.last_name, dummyUserCombinationTest.last_name);
            assert.equal(createUserData.password, undefined);
            assert.notEqual(createUserData.account_created, undefined);
            assert.notEqual(createUserData.account_updated, undefined);

            const getUserRes = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserCombinationTest_Basic_Token}`
                },
            });
            assert.equal(getUserRes.status, 200);

            const getUserData = await getUserRes.json();

            assert.notEqual(getUserData.id, undefined);
            assert.equal(getUserData.username, dummyUserCombinationTest.username);
            assert.equal(getUserData.first_name, dummyUserCombinationTest.first_name);
            assert.equal(getUserData.last_name, dummyUserCombinationTest.last_name);
            assert.equal(getUserData.password, undefined);
            assert.notEqual(getUserData.account_created, undefined);
            assert.notEqual(getUserData.account_updated, undefined);
        });

        it('Update the account and using the GET call, validate the account was updated', async () => {
            const newPassword = "password_new";
            const newFirstName = "test new";
            const newLastName = "last new"
            const updateUserRes = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserCombinationTest_Basic_Token}`
                },
                body: JSON.stringify({
                    first_name: newFirstName,
                    last_name: newLastName,
                    password: newPassword
                })
            });
            assert.equal(updateUserRes.status, 204);

            const getUserResUnAuthorized = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserCombinationTest_Basic_Token}`
                },
            });
            assert.equal(getUserResUnAuthorized.status, 401);

            dummyUserCombinationTest_Basic_Token = Buffer.from(`${dummyUserCombinationTest.username}:${newPassword}`, 'utf8').toString('base64');
            const getUserResAuthorized = await fetch(`http://localhost:${process.env.PORT}/v1/user/self`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${dummyUserCombinationTest_Basic_Token}`
                },
            });
            assert.equal(getUserResAuthorized.status, 200);

            const getUserAuthorizedData = await getUserResAuthorized.json();

            assert.notEqual(getUserAuthorizedData.id, undefined);
            assert.equal(getUserAuthorizedData.username, dummyUserCombinationTest.username);
            assert.equal(getUserAuthorizedData.first_name, newFirstName);
            assert.equal(getUserAuthorizedData.last_name, newLastName);
            assert.equal(getUserAuthorizedData.password, undefined);
            assert.notEqual(getUserAuthorizedData.account_created, undefined);
            assert.notEqual(getUserAuthorizedData.account_updated, undefined);
        });
    })
});