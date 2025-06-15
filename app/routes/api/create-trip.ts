import { type ActionFunctionArgs, data } from "react-router";
import { GoogleGenAI } from "@google/genai";

import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";
import { parseMarkdownToJson } from "lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    country,
    numberOfDays,
    travelStyle,
    interests,
    budget,
    groupType,
    userId,
    coordinates,
  } = await request.json();

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return ONLY a valid JSON object with the following structure - DO NOT include markdown code blocks or any other text:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights max number of words 1000",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${numberOfDays},
        "budget": "${budget}",
        "travelStyle": "${travelStyle}",
        "country": "${country}",
        "coordinates": [${coordinates[0]}, ${coordinates[1]}],
        "interests": ${interests},
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }
    Important rules:
    1. Must be valid JSON (all strings quoted, no trailing commas)
    2. No markdown code blocks (no \`\`\`json)
    3. No additional text outside the JSON object
    `;

    const textResult = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    if (!textResult.text) {
      throw new Error("No text result returned from Gemini AI");
    }

    const trip = parseMarkdownToJson(textResult.text || "");

    if (!trip) {
      console.error("Raw AI Response:", textResult.text);
      throw new Error("Failed to parse trip data. See logs for raw response.");
    }

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);
    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.itineraryCollectionId,
      ID.unique(),
      {
        itinerary_details: JSON.stringify(trip),
        created_at: new Date().toISOString(),
        image_url: imageUrls,
        user_id: userId,
      }
    );

    // const tripDetail = parseTripData(result.tripDetails) as Trip;
    // const tripPrice = parseInt(tripDetail.estimatedPrice.replace("$", ""), 10);
    // const paymentLink = await createProduct(
    //   tripDetail.name,
    //   tripDetail.description,
    //   imageUrls,
    //   tripPrice,
    //   result.$id
    // );

    // await database.updateDocument(
    //   appwriteConfig.databaseId,
    //   appwriteConfig.itineraryCollectionId,
    //   result.$id,
    //   {
    //     payment_link: paymentLink.url,
    //   }
    // );

    return data({ id: result.$id });
  } catch (e) {
    console.error("Error generating travel plan: ", e);
  }
};
