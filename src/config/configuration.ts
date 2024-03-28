export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  fillout: {
    apiKey: process.env.FILLOUT_API_KEY,
    formId: process.env.FILLOUT_FORM_ID,
  },
});
