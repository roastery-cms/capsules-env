import { Elysia } from "elysia";
import { t } from "@caffeine/models";
import { Schema } from "@caffeine/schema";
import { InvalidEnvironmentException } from "@caffeine/errors/infra";

export function CaffeineEnv<ContentType extends t.TObject[]>(
    ...args: ContentType
): Elysia<
    "",
    {
        decorator: {
            env: t.Static<t.TComposite<ContentType>>;
        };
        store: Record<string, unknown>;
        derive: Record<string, unknown>;
        resolve: Record<string, unknown>;
    }
> {
    type EnvType = t.Static<t.TComposite<ContentType>>;
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
