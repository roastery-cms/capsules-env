import { Elysia } from "elysia";
import { ServerDependenciesDTO } from "./dtos/server-dependencies.dto";
import { t } from "@roastery/terroir";
import { Schema } from "@roastery/terroir/schema";
import { InvalidEnvironmentException } from "@roastery/terroir/exceptions/infra";

export function env<ContentType extends t.TObject[]>(
	...args: ContentType
): Elysia<
	"",
	{
		decorator: {
			env: t.Static<t.TComposite<ContentType>> & ServerDependenciesDTO;
		};
		store: Record<string, unknown>;
		derive: Record<string, unknown>;
		resolve: Record<string, unknown>;
	}
> {
	type EnvType = t.Static<t.TComposite<ContentType>> & ServerDependenciesDTO;

	args.push(ServerDependenciesDTO);

	const envDTO = t.Composite<ContentType>(args);
	const envContent: EnvType = Object.fromEntries(
		Object.entries(envDTO.properties).map(([key, _]) => [
			key,
			process.env[key],
		]),
	) as never;

	if (!Schema.make(envDTO).match(envContent)) {
		throw new InvalidEnvironmentException("system@boot");
	}

	return new Elysia().as("global").decorate("env", envContent);
}
