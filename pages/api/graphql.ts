import { ApolloServer, gql } from "apollo-server-micro";
import { admin } from "../../utils/firebase-admin";
import cookie from "cookie";

const FieldValue = admin.firestore.FieldValue;

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: String!): User
  }

  type Mutation {
    signup(input: SignupInput!): Boolean!
    noteCreate(input: NoteInput!): Note!
    noteDelete(id: String!): Boolean!
    userUpdate(id: String!, input: UserInput!): User
  }

  type User {
    id: String!
    name: String
    email: String
    iban: String
    status: SubscriptionStatus
    notes: [Note]!
    admin: Boolean!
  }

  input UserInput {
    name: String
    email: String
    iban: String
    status: SubscriptionStatus
  }

  input SignupInput {
    name: String!
    email: String!
    iban: String!
    acceptGDPR: Boolean
  }

  enum SubscriptionStatus {
    PENDING_SETUP
    ACTIVE
    PENDING_CANCELLATION
    CANCELLED
  }

  type Note {
    id: String!
    content: String!
    createdAt: String!
  }

  input NoteInput {
    userId: String!
    content: String!
  }
`;

const admins = ["viktutetute@gmail.com", "axel_103@hotmail.com", "coline.cadoret@gmail.com", "sf.alden@yahoo.com"];

const resolvers = {
  Note: {
    createdAt: (note) => note.createdAt.toMillis(),
  },
  Query: {
    users: async (parent, args, context) => {
      console.log(context);
      const snapshot = await admin.firestore().collection("users").get();

      const output = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          output.push({ id: doc.id, ...doc.data() });
        });
      }

      return output;
    },
    user: async (parent, { id }, context) => {
      console.log("==content==");
      console.log(context);

      return { id: "123" };
    },
  },
  Mutation: {
    signup: async (parent, { input }, context) => {
      // TODO: Validate input
      const user = await admin.auth().createUser({
        displayName: input.name,
        email: input.email,
      });

      const isAdmin = admins.includes(input.email.toLowerCase());

      await admin.firestore().collection("users").doc(user.uid).set({
        id: user.uid,
        name: input.name,
        email: input.email,
        plan: input.plan,
        subscriptionStatus: "PENDING_SETUP",
        createdAt: user.metadata.creationTime,
        admin: isAdmin,
      });

      return true;
    },
    noteCreate: async (_, { input }) => {
      const insertedNote = await admin.firestore().collection("users").doc(input.userId).collection("notes").add({
        content: input.content,
        createdAt: FieldValue.serverTimestamp(),
        // createdBy: current user
      });

      const note = await insertedNote.get();

      return {
        id: insertedNote.id,
        ...note.data(),
      };
    },
    userUpdate: async (_, { id, input }) => {
      // const subscriptionRef = await admin.firestore().collection();
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log("== initialising context =======");
    // const cookies = cookie.parse(req.headers?.cookie);
    const { bearer } = req.headers;

    if (bearer) {
      const decoded = await admin
        .auth()
        .verifyIdToken(bearer)
        .catch((err) => {
          console.log(err);
        });
      if (decoded) {
        console.log(decoded);
        // TODO: If they've logged in but no user record (first time?) make one for them.
        const user = await (await admin.firestore().collection("users").doc(decoded.uid).get()).data();
        if (user) {
          return { user };
        }
      }
    }

    return {
      user: undefined,
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
