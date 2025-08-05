CREATE TABLE "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar(255) NOT NULL,
	"jobDesc" varchar(255) NOT NULL,
	"jobExperience" varchar(255) NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" varchar(255),
	"mockId" varchar(255) NOT NULL
);
