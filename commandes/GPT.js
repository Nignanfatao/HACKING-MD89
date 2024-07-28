const { zokou } = require('../framework/zokou');
const traduire = require("../framework/traduction");
const s = require('../set');
const axios = require('axios');

// Alexa command
zokou({nomCom:"alexa",reaction:"📡",categorie:"IA"}, async (dest, zk, commandeOptions) => {
  const {repondre, ms, arg} = commandeOptions;
  
  if (!arg || !arg[0]) {
    return repondre("YEES!\n _I'm listening to you._");
  }
  
  try {
    const userInput = arg.join(" ");
    const response = await axios.get(`http://api.brainshop.ai/get?bid=181821&key=ltFzFIXrtj2SVMTX&uid=[uid]&msg=${userInput}`);
    await repondre(response.data.cnt);
  } catch (error) {
    repondre("Something went wrong...");
  }
});

// Dalle command
zokou({nomCom:'dalle2',reaction:'📡',categorie:'IA'}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    if (!arg || arg.length === 0) {
      return repondre("Please enter the necessary information to generate the image.");
    }
    
    const prompt = arg.join(" ");
    const imageUrl = `https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=${prompt}`;
    
    zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: "*powered by FLASH-MD*"
    }, { quoted: ms });
  } catch (error) {
    console.error('Error:', error.message || "An error occurred");
    repondre("Oops, an error occurred while processing your request");
  }
});

// GPT command
zokou({nomCom:'gpt3.5',reaction:'📡',categorie:'IA'}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  if (!arg || arg.length === 0) {
    return repondre("Please ask a question.");
  }
  
  try {
    const prompt = arg.join(" ");
    const response = await axios.get(`https://api.maher-zubair.tech/ai/chatgpt3?q=${prompt}`);
    await repondre(response.data.result);
  } catch (error) {
    repondre("An error occurred while processing your request.");
  }
});

// Gemini command
zokou({nomCom:"gemini",reaction:'🤗',categorie:'IA'}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  if (!arg || arg.length === 0) {
    return repondre("Hello, I'm *HACKING-MD*, an AI developed by France King.\n\nWhat help can I offer you today?");
  }
  
  try {
    const prompt = arg.join(" ");
    const response = await axios.get(`https://api.maher-zubair.tech/ai/chatgpt3?q=${prompt}`);
    await repondre(response.data.result);
  } catch (error) {
    repondre("An error occurred while processing your request.");
  }
});

// Calculator command
zokou({nomCom:'calcul2',reaction:'🔢',categorie:'General'}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  if (!arg || arg.length === 0) {
    return repondre("Please insert math calculations like 100000+2024.\n\nNOTE: Use \"(/)\" for division and \"(*)\" for multiplication or letter x");
  }
  
  try {
    const calculation = arg.join(" ");
    const response = await axios.get(`https://api.maher-zubair.tech/ai/mathssolve?q=${calculation}`);
    await repondre(response.data.result);
  } catch (error) {
    repondre("An error occurred while processing your calculation.");
  }
});

// GPT-4 command
zokou({nomCom:"gpt4",reaction:'📡',categorie:'IA'}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    if (!arg || arg.length === 0) {
      return repondre("Please ask a question.");
    }
    
    const prompt = arg.join(" ");
    const response = await axios.get(`https://api.maher-zubair.tech/ai/chatgpt4?q=${prompt}`);
    
    if (response.data) {
      repondre(response.data.data);
    } else {
      repondre("Error during response generation.");
    }
  } catch (error) {
    console.error('Error:', error.message || "An error occurred");
    repondre("Oops, an error occurred while processing your request.");
  }
});

// Best Wallpaper command
zokou({nomCom:"best-wallp",reaction:'🙌',categorie:"Thomas"}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc");
    const imageUrl = response.data.urls.regular;
    
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: "*POWERED BY FLASH-MD*"
    }, { quoted: ms });
  } catch (error) {
    repondre("An error occurred while fetching the image.");
  }
});

// Random Image command
zokou({nomCom:"random",reaction:'🥂',categorie:"Thomas"}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc");
    const imageUrl = response.data.urls.regular;
    
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: "*POWERED BY FLASH-MD*"
    }, { quoted: ms });
  } catch (error) {
    repondre("An error occurred while fetching the image.");
  }
});

// Nature Image command
zokou({nomCom:"nature",reaction:'🦗',categorie:"Thomas"}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc");
    const imageUrl = response.data.urls.regular;
    
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: "*POWERED BY FLASH-MD*"
    }, { quoted: ms });
  } catch (error) {
    repondre("An error occurred while fetching the image.");
  }
});

// Time command
zokou({nomCom:'time',reaction:'⌚',categorie:"General"}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    if (!arg || arg.length === 0) {
      return repondre("Enter the name of the country you want to know its time and date");
    }
    
    const country = arg.join(" ");
    const response = await axios.get(`https://levanter.onrender.com/time?code=${country}`);
    const time = response.data.result[0].time;
    await repondre(time);
  } catch (error) {
    repondre("That country name is incorrect!");
  }
});

/*zokou({ nomCom: "gpt4", reaction: "📡", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre("Veuillez poser une question.");
    } else {
      const question = arg.join(" ");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${s.GPT4}`, // Remplacez s.GPT4 par votre clé d'API OpenAI pour GPT-4
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "system", content: "You" }, { role: "user", content: question }],
        }),
      });

      const data = await response.json();
      console.log("GPT-4 RESPONSE: ", data);
      if (!data.choices || data.choices.length === 0) {
        repondre("Votre API est invalide, veuillez insérer une nouvelle.");
      } else {
        return repondre(data.choices[0].message.content);
      }
    }
  } catch (error) {
    console.error("Erreur:", error.message || "Une erreur s'est produite");
    repondre("Oups, une erreur est survenue lors du traitement de votre demande.");
  }
});/*
