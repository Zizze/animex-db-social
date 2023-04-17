import emailjs from "@emailjs/browser";

interface ITemplateParams {
	[key: string]: string;
	admin_name: string;
	user_name: string;
	answer: string;
	user_message: string;
	user_email: string;
}

export const sendEmail = (templateParams: ITemplateParams) => {
	const serviceId = process.env.EMAILJS_SERVICE_ID;
	const templateId = process.env.EMAILJS_TEMPLATE_ID;
	const key = process.env.EMAILJS_KEY;

	if (serviceId && templateId && key) {
		emailjs.send(serviceId, templateId, templateParams, key);
	}
};
