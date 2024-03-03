import { v4 as uuidv4 } from 'uuid';

export default {
	userName: "solace-cloud-client",
	password: "ggkm4e7ookoujmbnngjrjcl1pg",
	invocationContext: {
		host: "mr-connection-7xb77sv49db.messaging.solace.cloud",
		port: 8443,
		clientId: uuidv4()
	},
	timeout: 3,
	keepAliveInterval: 60,
	cleanSession: true,
	useSSL: true,
	reconnect: true
};