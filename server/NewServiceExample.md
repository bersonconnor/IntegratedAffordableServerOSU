# Creating a new service: A comprehensive end-to-end example

As an example, let's extend Affordable so that Organizations could create groups of grants. The first thing to do is to establish the requirements and constraints. Let's say that

* Organizations must be able to create groups
* A single group may only be managed by one organization
* A grant may belong to multiple groups
* Groups must have additional metadata, for example, group names.
* There must be a way to retrieve all of the grants in a group at one time.

There's no right steps to follow to create an effective, simple, and scalable service but one way to do it is to think about (on one end) how you can store those groups, and (on the other end) how a user would interact with this model.

## How to organize grants into groups

Given the constraints above, we know that there is a one-to-many relationship between organizations and grant groups, a many-to-many relationship between grant groups and grants, and that we must store additional data about grant groups. One way to capture this information in the database is to add two new tables. We can put them in [CreateDatabase.sql](../database/CreateDatabase.sql), which gets called when we run `yarn create-affordable-database`.

One table can store information about groups:

```sql
CREATE TABLE GrantGroup(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `organizationId` INT NOT NULL,
    `name` VARCHAR(255),
    `description` VARCHAR(1000),
    PRIMARY KEY(id),
    CONSTRAINT NO_DUPE_NAME_IN_ORG UNIQUE (organizationId, groupName),
    FOREIGN KEY(organizationId) REFERENCES Organization(id) ON DELETE CASCADE
);
```

And one can store associations between grants and grant groups

```sql
CREATE TABLE GrantGroupAssociation(
    `groupId` INT NOT NULL,
    `grantId` INT NOT NULL,
    PRIMARY KEY(groupId, grantId),
    FOREIGN KEY(groupId) REFERENCES GrantGroup(id) ON DELETE CASCADE,
    FOREIGN KEY(grantId) REFERENCES Grant(id) ON DELETE CASCADE
);
```

## Creating an intuitive REST API

We now have to think about how a user will interact with Affordable in two ways:

* What atomic operations should a user have at their disposal to achieve the desired use-cases?
* What conceptual objects should users be expected to create and expect to receive?

### Atomic interactions: endpoints

Some common operations for this service would include

* Creating a group with metadata
* Updating a group's metadata
* Deleting a group
* Adding grants to a group
* Removing grants from a group
* Getting all of the grants in a group

Some of these are flexible in design and depend on how users tend to use them. For example, should users be able to add multiple grants to a group at one time? Is it acceptable for users to add grants one-at-a-time? There are arguments for usability and performance that go each way, and these depend on use cases.

We can note here that since groups necessarily belong to one and only one organization, we can re-use the organization path to create our endpoints:

| Verb      | Endpoint |  Operation  |
| ----------- | ----------- | ------ |
| `GET`      | `organization/:organizationId/group/:groupId`       |  Get a group and all of the grants in it |
| `POST`      | `organization/:organizationId/group`       |  Create a new group |
| `PUT`      | `organization/:organizationId/group/:groupId`       |  Update an existing group |
| `DELETE`      | `organization/:organizationId/group/:groupId`       |  Delete a group |
| `POST`      | `organization/:organizationId/group/:groupId/grants`       |  Add one or more grants to a group |
| `DELETE`      | `organization/:organizationId/group/:groupId/grants`       |  Remove one or more grants from a group |

We can add these routes to the [OrganizationRouter](./src/routes/OrganizationRouter.ts) just as that file shows. If your service requires a new router, make sure it's loaded and used in [app.ts](./src/app.ts).


### Conceptual Objects: Data Transfer Objects

We should create data transfer objects in the [affordable-shared-models](../core/src/models) package. The purpose of these objects is to provide an intuitive, conceptual model that can be handled by frontend developers, experienced users that wish to access Affordable programmatically, and within your service layer. These objects may be similar to or radically different from your database model, depending on your solution.

Here we can create a new `GrantGroup` object:

`/core/src/models/GrantGroup.ts`
```ts
import { Grant } from "./Grant.ts"
import { Organization } from "./Organization.ts"

export class GrantGroup {
    /**
     * The unique identifier of a group that refrences Grants
     */
    id: number;

    /**
     * The organization that owns the group
     */
    organization: Organization;

    /**
     * The name of the group. Must be unique across the organization.
     */
    name: string;

    /**
     * The description of the group
     */
    description: string;

    /** 
     * The grants in the group
     */
    grants[]: Grant[]
};
```

There were a couple decisions made in creating this model based on assumed use cases. We could have chosen to pass the organization as an ID because the caller might rarely need the full object. We pass the full grant objects because when a user is retrieving a group, they likely want to see all of the grants, so we should pass the full object to them.

If we want users to be able to add/remove many grants at once, we can require them to send an array of grant IDs. It's recommended to create one or more classes to represent this, but we'll skip that for brevity and just use an array.

After you've created these files, make sure they are exported by the package in [index.ts](../core/src/index.ts)


### Result

All in all, our REST API looks like this: 

| Verb    | Endpoint                                            |  Operation  |  Request Body  |  Response Body | 
| --------| --------------------------------------------------- | ------ | ----- | ----- |
| `GET`   | `organization/:organizationId/group/:groupId`       |  Get a group and all of the grants in it | - |GrantGroup|
| `POST`  | `organization/:organizationId/group`                |  Create a new group |GrantGroup|GrantGroup|
| `PUT`   | `organization/:organizationId/group/:groupId`       |  Update an existing group |GrantGroup|GrantGroup|
| `DELETE`| `organization/:organizationId/group/:groupId`       |  Delete a group |-|-|
| `POST`  | `organization/:organizationId/group/:groupId/grants`|  Add one or more grants to a group |Array\<number\>|-|
| `DELETE`| `organization/:organizationId/group/:groupId/grants`|  Remove one or more grants from a group |Array\<number\>|-|


## Interacting with the Database: the Data Access Layer

When your application interacts with a database, it's helpful to have way to convert tuples in your relation into objects that you can interact with in TypeScript. Here, you can create classes that execute parameterized SQL queries, but Affordable also uses TypeORM, a package that can handle conversions between objects and relations and provide type-safety if you use it in certain ways.

### TypeORM-powered Database Objects

We'll first create new database objects that mirror the SQL above, using TypeORM decorators (like `@Entity`):

`server/src/models/orm/GrantGroup.ts`
```ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrantDBO } from "./GrantDBO";
import { Grant } from "affordable-shared-models";

@Entity({name: "GrantGroup"})
export class GrantGroupDBO {

    /**
     * The unique ID of the group
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The organization that owns this group.
     */
    @Column({ nullable: false })
    public organizationId: number;

    /**
     * The name of the group
     */
    @Column()
    name: string;

    /**
     * The description of the group
     */
    @Column()
    description: string;

    // The grants that this eligibilty applies to
    @ManyToOne(type => GrantGroupAssociationDBO,
     grant => grant.groupId,
      { eager: true } // Setting eager to true causes grants to always be loaded
      )
    grantAssociations?: GrantGroupAssociationDBO[];
}
```

`server/src/models/orm/GrantGroupAssociationDBO.ts`
```ts
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {GrantGroupDBO} from "./GrantGroupDBO";
import {GrantDBO} from "./grant/GrantDBO";

@Entity({ name: "GrantGroupAssociation" })
export class GrantGroupAssociationDBO {
    @ManyToOne(type => GrantGroupDBO, group => group.grantAssociations)
    public group: GrantGroupDBO;

    @PrimaryColumn({type: "int"})
    public groupId: number;

    @ManyToOne(type => GrantDBO, grant => grant.groupAssociations, {eager: true})
    public grant: GrantDBO;

    @PrimaryColumn({type: "int"})
    public grantId: number;
}
```

If you decide to add relations, you'll have to modify the database objects you add relations to, like [OrganizationDBO.ts](./src/models/orm/OrganizationDBO.ts) and [GrantDBO.ts](./src/models/orm/grant/GrantDBO.ts). For more information, see the [TypeORM docs](typeorm.io).

Lastly, you'll need to register your new object with TypeORM by adding it to the list of DBOs in [DatabaseConnection](./src/database/DatabaseConnection.ts)

### Creating a Data Access Object

Now we'll need to create a new class that actually manages saving, updating, deleting, and retrieving this information.

A good example of how to write a DAO using TypeORM is the [DBOGrantDAOImpl](./src/database/dao/grant/DBOGrantDAOImpl.ts).

One thing to note when retreiving options is when possible, use `.getRepository(DBO).find()` because your queries will be type-safe, assuming your database object class is up-to-date and matches the MySQL database.

In this case, we'll just have one DAO that handles grant groups and grant group associations, but having two DAOs is reasonable as well.

We'll just outline the interface. For an implementation, see [DBOGrantDAOImpl](./src/database/dao/grant/DBOGrantDAOImpl.ts).

`server/src/database/dao/GrantGroupDAO.ts`
```ts
import { GrantDBO } from "../../../models/orm/grant/GrantDBO";

export interface GrantGroupDAO {
    /**
     * Creates a Grant Group
     * @param group
     */
    createGroup(group: GrantGroupDBO): Promise<GrantGroupDBO>;

    /**
     * Updates a Grant Group
     * @param group
     */
    updateGrant(group: GrantGroupDBO): Promise<GrantGroupDBO>;

    /**
     * Get a grant group by its ID
     * @param id
     * @throws NotFoundError {@class NotFoundError} if no GrantGroup is found
     */
    getGroupById(id: number): Promise<GrantGroupDBO>;

    /**
     * Deletes a grant group by ID
     * @param id
     */
    deleteGroupById(id: number): Promise<void>;

    /**
     * Adds grants to a group
     * @param id
     */
    addGrantsToGroup(grantIds: number[], groupId: number): Promise<void>;

    /**
     * Removes grants from a group
     * @param id
     */
    removeGrantsFromGroup(grantIds: number[], groupId: number): Promise<void>;
}
```

## The Service Layer

Now we can create our service layer, where we can utilize the desired domain logic in Affordable to make the application work correctly.

This will be heavily abbreviated, so see [GrantServiceImpl](./src/services/grant/GrantServiceImpl.ts) for an example

`server/src/services/GrantGroupServiceImpl.ts`
```ts
// ...imports
export class GrantGroupServiceImpl implements GrantGroupService {

    //...constructor and private fields

    async getGroup(userInfo: UserInfo, groupId: number): Promise<GrantGroup> {
        // Check the user info to see if the user is authorized.
        AuthorizationUtils.checkAuthorization(userInfo);
        // Use Validation to check that the user passed necessary information
        Validation.requireParam(organizationId, "organizationId");

        // Get the object and convert it into the data transfer object
        const group = convertToDTO(await this.grantGroupDao.getGroupById(groupId))

        // Make sure that the user has permission to see the group
        const userCanSeeGroup = await this.organizationService.userBelongsToOrganization(userInfo.id, group.organization.id);
        if (!userCanSeeGroup) {
            // Throw an appropriate error if they shouldn't be able to see it
            throw new UnauthorizedError(`You cannot see this group because it is managed by organization id: ${existingGrant.organization.id}, and you are not a member of that organization`);
        }
        return group;
    }

    // ... other methods for operations described above
}
```

## The Controller

The final piece to tie the service together is to add the controller. In the controller, every method will take a function with the same parameters and return type:

```ts
public createGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
```

These `Request`, `Response`, and `NextFunction` objects are provided by Express. These objects represent the HTTP request and response, and a function for sending the request to the next middleware function.

Each of your methods will look something like this:

```ts
public async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const organizationId = req.params.organizationId; // You access params (defined in the router) with req.params.paramName
    const groupToCreate = req.body as GrantGroup; // You access the body with req.body
    // You may do light manipulation of objects to ensure the request is in correct form
    groupToCreate.organization.id = organizationId;
    // Previous middleware function will authenticate the user by putting their info in res.locals.userInfo
    const userInfo = res.locals.userInfo as UserInfo;
    try {
        
        const createdGroup = await this.grantGroupService.createGroup(userInfo, groupToCreate);
        // On success, set the HTTP status to 200 and send the object in JSON
        res.status(200).json(createdGrant);
    } catch (error) {
        // If there is an error, send the error to the next middleware function
        // The error handler middleware function will convert the error to a specific HTTP error
        next(error);
    }
}
```

## Simplifying the API for users: the Client

To make it easier to interact with the Affordable API, we document each method in the [AffordableClient](../client/src/AffordableClient.ts). By doing this, developers of the React app and programmatic users may easily interact with the Affordable backend with predefined methods and typings.

As an example, we can add a method to the client to simplify creating a grant group:

`client/src/AffordableClient.ts`
```ts
   /** 
    * Create a group of grants in Affordable
    * @param group
    */
    createGrant(organizationId: number, group: GrantGroup): Promise<GrantGroup> {
        return this.doPost<Grant>(`${this.getBaseURL()}ORGANIZATION_EP/${organizationId}/group`, group);
    }
```

a user of the AffordableClient can then clearly see how to create a group, and what object they must create to create that group.

## Testing

There are a few different strategies to test your feature. One way to ensure that your feature works in a scenario context is to write an integration test, where you can use the AffordableClient to create a user and test that your feature works as expected from the outside. As an example, see [Grant integration tests](./src/test/integration/ITGrant.test.ts). Note that integration tests are not run by `yarn test`, only `yarn test:all` or `yarn test:integration`, and will only work if the backend is running.

You should strive to write unit tests for each of your methods in the service layer. You can use `jest` and `jest-mock-extended` to mock out the behavior of other classes and methods. By doing this, you can ensure that each unit is behaving as expected when receiving guaranteed results from other classes and dependencies. For examples, see [unit tests for GrantServiceImpl](./src/services/grant/test/GrantServiceImpl.unit.test).

