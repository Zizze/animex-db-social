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
	const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
	const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
	const key = process.env.NEXT_PUBLIC_EMAILJS_KEY;

	if (serviceId && templateId && key) {
		emailjs.send(serviceId, templateId, templateParams, key);
	}
};
