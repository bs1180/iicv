import { ApolloServer, gql } from "apollo-server-micro";

const typeDefs = gql`
  type Query {
    members: [Member!]!
  }
  type Mutation {
    signup(input: SignupInput!): Boolean!
  }
  type Member {
    id: Int!
    name: String
    email: String
    notes: [Note]!
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
  type Subscription {
    id: Int!
    iban: String
    status: SubscriptionStatus
  }
  type Note {
    id: Int!
    content: String!
    # created_at: DateTime!
  }
`;

const resolvers = {
  Query: {
    members(parent, args, context) {
      return [{ name: "Nextjs" }];
    },
  },
  Mutation: {
    signup(parent, args, context) {
      console.log(args);
      return true;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
