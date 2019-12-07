const Alexa = require('ask-sdk-core')
const axios = require('axios')

async function getQuote() {
  const response = await axios.get('https://api.kanye.rest')
  return response.data.quote
}

const CancelAndStopIntentsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Peace out!')
      .withShouldEndSession(true)
      .getResponse()
  },
}

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("My bad, not sure what you were looking for. Do you want a Kanye quote?")
      .reprompt("Would you like a quote from Kanye West?")
      .withShouldEndSession(false)
      .getResponse()
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Wisdom of West is your fount of the teachings of Kanye West. You can say 'enlighten me' to get some of that Wisdom.")
      .reprompt("Wisdom of West is your fount of the teachings of Kanye West. You can say 'enlighten me' to get some of that Wisdom.")
      .withShouldEndSession(false)
      .getResponse()
  },
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Welcome, to the Wisdom of West! Would you like a nugget of brilliance from Kanye?')
      .reprompt('Would you like a quote from Kanye West?')
      .withShouldEndSession(false)
      .getResponse()
  },
}

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Peace out!')
      .withShouldEndSession(true)
      .getResponse()
  },
}

const NoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
  },
  handle(handlerInput) {
    const speechText = 'I understand, one can only absorb so much wisdom at once. Deuces!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse()
  },
}

const YesIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
  },
  async handle(handlerInput) {
    const quote = await getQuote()

    return handlerInput.responseBuilder
      .speak(`Here is your quote: <break strength='strong' />${quote}<break strength='strong' /> Would you like another gem?`)
      .reprompt('Would you like more words from the genius?')
      .withShouldEndSession(false)
      .getResponse()
  },
}

const QuoteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'QuoteIntent'
  },
  async handle(handlerInput) {
    const quote = await getQuote()

    return handlerInput.responseBuilder
      .speak(`Here is your quote: <break strength='strong' />${quote}<break strength='strong' /> Would you like another pearl of wisdom?`)
      .reprompt('Shall I hit you with more knowledge?')
      .withShouldEndSession(false)
      .getResponse()
  },
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("My bad, didn't catch that. Can you repeat it?")
      .reprompt("My bad, didn't catch that. Can you repeat it?")
      .withShouldEndSession(false)
      .getResponse()
  },
}

const builder = Alexa.SkillBuilders.custom()

exports.handler = builder
  .addRequestHandlers(
    CancelAndStopIntentsHandler,
    FallbackIntentHandler,
    HelpIntentHandler,
    LaunchRequestHandler,
    NoIntentHandler,
    QuoteIntentHandler,
    YesIntent,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
