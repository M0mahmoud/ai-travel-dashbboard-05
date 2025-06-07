import { ID, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

// Get existing user by account ID
export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("account_id", id)]
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Store user data in the database if it doesn't exist
export const storeUserData = async () => {
  try {
    const user = await account.get(); // Get the currently logged in user.
    if (!user) throw new Error("User not found");

    const { providerAccessToken, provider } =
      (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getUserPicture(provider, providerAccessToken)
      : null;

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        account_id: user.$id,
        email: user.email,
        name: user.name,
        image_url: profilePicture,
        created_at: new Date().toISOString(),
      }
    );

    if (!createdUser.$id) redirect("/login");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

const getUserPicture = async (provider: string, accessToken: string) => {
  try {
    if (provider === "google") {
      const response = await fetch(
        "https://people.googleapis.com/v1/people/me?personFields=photos",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Failed to fetch Google profile picture");
      const { photos } = await response.json();
      return photos?.[0]?.url || null;
    }

    if (provider === "github") {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok)
        throw new Error("Failed to fetch GitHub profile picture");
      const data = await response.json();
      return data?.avatar_url || null;
    }

    throw new Error("Unsupported provider");
  } catch (error) {
    console.error(`Error fetching ${provider} picture:`, error);
    return null;
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect("/login");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("account_id", user.$id),
        Query.select([
          "name",
          "email",
          "image_url",
          "created_at",
          "account_id",
        ]),
      ]
    );

    return documents.length > 0 ? documents[0] : redirect("/login");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
