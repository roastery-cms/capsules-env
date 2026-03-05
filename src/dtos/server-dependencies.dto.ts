import { t } from "@roastery/terroir";

export const ServerDependenciesDTO = t.Object({
	PORT: t.String(),
	NODE_ENV: t.Union([
		t.Literal("DEVELOPMENT"),
		t.Literal("TESTING"),
		t.Literal("PRODUCTION"),
	]),
});

export type ServerDependenciesDTO = t.Static<typeof ServerDependenciesDTO>;
