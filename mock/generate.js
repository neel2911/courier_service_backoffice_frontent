var faker = require("faker");

var database = { users: [], studies: [] };

for (var i = 1; i <= 300; i++) {
  database.users.push({
    id: i,
    employeeId: faker.random.alphaNumeric(4),
    name: faker.name.firstName() + " " + faker.name.lastName(),
    userName: faker.name.firstName(),
    passCode: faker.random.alphaNumeric(6),
    role: faker.random.alphaNumeric(3),
    status: i % 7 == 0 ? "unblock" : "block",
    accessStartDate: new Date(faker.date.past()).getTime(),
    accessEndDate: new Date(faker.date.future()).getTime(),
    contactNumber: faker.phone.phoneNumber(),
    emailId: faker.internet.email(),
    address: faker.address.streetAddress(),
    description: faker.lorem.lines(1),
    lastLoggedIn: new Date(faker.date.past()).getTime(),
    createdAt: new Date(faker.date.past()).getTime(),
    createdBy: faker.name.firstName() + " " + faker.name.lastName(),
    updatedAt: new Date(faker.date.past()).getTime(),
    updatedBy: faker.name.firstName() + " " + faker.name.lastName(),
  });
}

console.log(JSON.stringify(database));
