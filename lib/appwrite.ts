import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { appwriteConfig } from "@/appwriteConfig";
import { VehicleFormData } from "@/app/(tabs)/(add)/add-vehicle";

const {
  endpoint,
  platform,
  projectId,
  userCollectionId,
  storageId,
  databaseId,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export async function createUser(
  email: string,
  password: string,
  username: string,
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    // await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      },
    );

    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  console.log("GET CURRENT ACCOUNT ");
  try {
    const currentAccount = await account.get();
    console.log("CURRENT ACCOUNT", currentAccount.$id);

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );
    if (!currentUser) throw Error;

    console.log("CURRENT USER", currentUser);

    return currentUser.documents[0];
  } catch (error: any) {
    console.log("ERROR FAKTYCZNY ERROR ", error);
    throw new Error(error);
  }
};

// Create new vehicle
export const createVehicle = async (vehicleFormData: VehicleFormData) => {
  try {
    const newVehicle = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vehicleCollectionId,
      ID.unique(),
      {
        ...vehicleFormData,
      },
    );
    return newVehicle;
  } catch (error: any) {
    throw new Error(error);
  }
};
