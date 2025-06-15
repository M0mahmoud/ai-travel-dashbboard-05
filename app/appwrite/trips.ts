import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
  const allTrips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.itineraryCollectionId,
    [Query.limit(limit), Query.offset(offset), Query.orderDesc("created_at")]
  );

  if (allTrips.total === 0) {
    return {
      trips: [],
      total: 0,
    };
  }

  return {
    trips: allTrips.documents,
    total: allTrips.total,
  };
};

export const getTripById = async (tripId: string) => {
  const trip = await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.itineraryCollectionId,
    tripId
  );
  if (!trip.$id) {
    console.error("Trip not found:", tripId);
    return null;
  }

  return trip;
};
