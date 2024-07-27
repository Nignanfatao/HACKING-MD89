const { zokou } = require("../framework/zokou");
const s = require("../set");
const fs = require('fs');
const dotenv = require('dotenv');

// Fonction pour obtenir la description d'une variable d'environnement depuis app.json
function getDescriptionFromEnv(varName) {
  const filePath = "./app.json";
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const jsonContent = JSON.parse(fileContent);
  const envVar = jsonContent.env[varName];
  return envVar && envVar.description ? envVar.description : "La description de la variable d'environnement n'a pas été trouvée.";
}

// Commande pour définir une variable d'environnement
zokou({
  'nomCom': 'setvar',
  'categorie': "Heroku"
}, async (dest, zok, comm) => {
  const { repondre, superUser, arg } = comm;
  
  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }

  if (s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null) {
    repondre("Veuillez renseigner les variables d'environnement HEROKU_APP_NAME et HEROKU_APY_KEY");
    return;
  }

  if (!arg[0] || !arg.join('').split('=')) {
    repondre("Mauvais format ; voici le mode d'emploi.\nSetvar NOM_OWNER=Fredora");
    return;
  }

  const fullArg = arg.join(" ");
  const heroku = new (require("heroku-client"))({ token: s.HEROKU_APY_KEY });
  let herokuPath = "/apps/" + s.HEROKU_APP_NAME;
  
  await heroku.patch(herokuPath + "/config-vars", {
    body: { [fullArg.split('=')[0]]: fullArg.split('=')[1] }
  });
  
  await repondre("Variable actualisée, redémarrage en cours....");
});

// Commande pour obtenir toutes les variables d'environnement
zokou({
  'nomCom': "getallvar",
  'categorie': 'Heroku'
}, async (dest, zok, comm) => {
  const { repondre, superUser } = comm;
  
  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }

  if (s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null) {
    repondre("Veuillez renseigner les variables d'environnement HEROKU_APP_NAME et HEROKU_APY_KEY");
    return;
  }

  const heroku = new (require("heroku-client"))({ token: s.HEROKU_APY_KEY });
  let herokuPath = '/apps/' + s.HEROKU_APP_NAME;
  let configVars = await heroku.get(herokuPath + '/config-vars');
  
  let message = "*Liste des variables Heroku*\n\n";
  for (let vr in configVars) {
    message += "🍁 *" + vr + "* = " + configVars[vr] + "\n";
  }
  
  repondre(message);
});

// Commande pour obtenir une variable d'environnement spécifique
zokou({
  'nomCom': "getvar",
  'categorie': "Heroku"
}, async (dest, zok, comm) => {
  const { repondre, superUser, arg } = comm;
  
  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }

  if (s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null) {
    repondre("Veuillez renseigner les variables d'environnement HEROKU_APP_NAME et HEROKU_APY_KEY");
    return;
  }

  if (!arg[0]) {
    repondre("Insérez le nom de la variable en majuscules");
    return;
  }

  try {
    const heroku = new (require("heroku-client"))({ token: s.HEROKU_APY_KEY });
    let herokuPath = "/apps/" + s.HEROKU_APP_NAME;
    let configVars = await heroku.get(herokuPath + "/config-vars");
    
    for (let vr in configVars) {
      if (arg.join(" ") === vr) {
        return repondre(vr + " = " + configVars[vr]);
      }
    }
  } catch (error) {
    repondre("Erreur lors de la procédure : " + error);
  }
});

// Commande pour les paramètres
zokou({
  'nomCom': 'settings',
  'categorie': "Heroku"
}, async (dest, zok, comm) => {
  const { ms, repondre, superUser, auteurMessage } = comm;
  
  if (!superUser) {
    repondre("Commande réservée au propriétaire du bot");
    return;
  }

  let variables = [
    { nom: "LECTURE_AUTO_STATUS", choix: ['oui', "non"] },
    { nom: "TELECHARGER_AUTO_STATUS", choix: ['oui', 'non'] },
    { nom: 'PM_PERMIT', choix: ['oui', "non"] },
    { nom: 'MODE_PUBLIC', choix: ["oui", "non"] },
    { nom: 'ANTI_VUE_UNIQUE', choix: ["oui", "non"] },
    { nom: "STARTING_BOT_MESSAGE", choix: ["oui", "non"] },
    { nom: 'ETAT', choix: ['1', '2', '3', '4'] },
    { nom: "PM_CHATBOT", choix: ["oui", "non"] },
    { nom: "ANTI_COMMAND_SPAM", choix: ["oui", "non"] }
  ];

  // Tri des variables par nom
  variables.sort((a, b) => a.nom.localeCompare(b.nom));

  let message = "    ╭──────༺♡༻──────╮\n              HACKIND-SETTINGS\n    ╰──────༺♡༻──────╯\n\n";
  variables.forEach((v, index) => {
    message += `${index + 1}- *${v.nom}*\n`;
  });
  message += "\nChoisissez une variable par son chiffre";

  let msg = await zok.sendMessage(dest, { text: message }, { quoted: ms });

  let reponse = await zok.awaitForMessage({
    chatJid: dest,
    sender: auteurMessage,
    timeout: 60000,
    filter: m => m.message.extendedTextMessage && 
                 m.message.extendedTextMessage.contextInfo.stanzaId == msg.key.id && 
                 m.message.extendedTextMessage.text > 0 && 
                 m.message.extendedTextMessage.text <= variables.length
  });

  let choixIndex = reponse.message.extendedTextMessage.text - 1;
  let { nom, choix } = variables[choixIndex];

  let messageChoix = "    ╭──────༺♡༻──────╮\n              Zokou-settings\n    ╰──────༺♡༻──────╯\n\n";
  messageChoix += `*Nom* : ${nom}\n`;
  messageChoix += `*Description* : ${getDescriptionFromEnv(nom)}\n\n`;
  messageChoix += "┌────── ⋆⋅☆⋅⋆ ──────┐\n\n";
  choix.forEach((c, i) => {
    messageChoix += `* *${i + 1}* => ${c}\n`;
  });
  messageChoix += "\n└────── ⋆⋅☆⋅⋆ ──────┘\n\nVeuillez entrer le chiffre correspondant à votre choix";

  let msgChoix = await zok.sendMessage(dest, { text: messageChoix }, { quoted: reponse });

  let reponseChoix = await zok.awaitForMessage({
    chatJid: dest,
    sender: auteurMessage,
    timeout: 60000,
    filter: m => m.message.extendedTextMessage && 
                 m.message.extendedTextMessage.contextInfo.stanzaId == msgChoix.key.id && 
                 m.message.extendedTextMessage.text > 0 && 
                 m.message.extendedTextMessage.text <= choix.length
  });

  let choixFinal = reponseChoix.message.extendedTextMessage.text - 1;

  // Mise à jour de la variable
  if (s.HEROKU == "non") {
    try {
      const envConfig = dotenv.parse(fs.readFileSync("set.env", { encoding: 'utf-8' }));
      envConfig[nom] = choix[choixFinal];
      const updatedEnv = Object.keys(envConfig).map(key => `${key}=${envConfig[key]}`).join("\n");
      fs.writeFileSync("set.env", updatedEnv);
      repondre("Variable actualisée avec succès\nRedémarrage en cours");
      require("child_process").exec("pm2 restart all");
    } catch (error) {
      console.error(error);
      repondre("Erreur");
    }
  } else {
    if (s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null) {
      return repondre("Veuillez renseigner les variables d'environnement HEROKU_APP_NAME et HEROKU_APY_KEY");
    }
    const heroku = new (require("heroku-client"))({ token: s.HEROKU_APY_KEY });
    try {
      let herokuPath = "/apps/" + s.HEROKU_APP_NAME;
      await heroku.patch(herokuPath + "/config-vars", {
        body: { [nom]: choix[choixFinal] }
      });
      await repondre("Variable actualisée, redémarrage en cours....");
    } catch (error) {
      repondre("Il semblerait que vous ayez fait une erreur au niveau des variables Heroku");
    }
  }
});

// Fonction pour créer des commandes de changement de variables
function changevars(nomCommande, nomVariable) {
  zokou({
    'nomCom': nomCommande,
    'categorie': 'Heroku'
  }, async (dest, zok, comm) => {
    const { arg, superUser, repondre } = comm;
    
    if (!arg[0]) {
      repondre(getDescriptionFromEnv(nomVariable));
      return;
    }

    if (s.HEROKU == 'non') {
      try {
        const envConfig = dotenv.parse(fs.readFileSync('set.env', { encoding: "utf-8" }));
        envConfig[nomVariable] = arg.join(" ");
        const updatedEnv = Object.keys(envConfig).map(key => `${key}=${envConfig[key]}`).join("\n");
        fs.writeFileSync("set.env", updatedEnv);
        repondre("Variable actualisée avec succès\nRedémarrage en cours");
        require("child_process").exec("pm2 restart all");
      } catch (error) {
        console.log(error);
        repondre("Erreur");
      }
    } else {
      if (!superUser) {
        repondre("Vous n'avez pas de droit sur cette catégorie de commande");
        return;
      }

      if (s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null) {
        repondre("Veuillez renseigner les variables d'environnement HEROKU_APP_NAME et HEROKU_APY_KEY");
        return;
      }

      const heroku = new (require('heroku-client'))({ token: s.HEROKU_APY_KEY });
      let herokuPath = '/apps/' + s.HEROKU_APP_NAME;
      await heroku.patch(herokuPath + '/config-vars', {
        body: { [nomVariable]: arg.join(" ") }
      });
      await repondre("Variable actualisée, redémarrage en cours....");
    }
  });
}

// Création des commandes de changement de variables
changevars("setprefix", "PREFIXE");
changevars('linkmenu', 'LIENS_MENU');
changevars('warncount', "WARN_COUNT");
changevars("botname", 'NOM_BOT');