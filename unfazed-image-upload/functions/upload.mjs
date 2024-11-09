import { Octokit } from "@octokit/rest";

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { shoeBrand, shoeName, imageData } = await req.json();

    // Validate input
    if (!shoeBrand || !shoeName || !imageData) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // GitHub repository details
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const path = `shoes/${shoeBrand}-${shoeName}.jpg`;

    // Remove the data URL prefix to get just the base64-encoded image data
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");

    try {
      // Try to create the file
      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Upload shoe image: ${shoeBrand} ${shoeName}`,
        content: base64Image,
        encoding: "base64"
      });

      console.log('response', response);

      return new Response(JSON.stringify({
        message: "Image uploaded successfully",
        url: response.data.content.download_url
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("GitHub API Error:", error);
      return new Response(JSON.stringify({ error: "Failed to upload image to GitHub" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};