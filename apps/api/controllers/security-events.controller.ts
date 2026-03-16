import { normalizeLoginEvent, type LoginEvent } from "../services/security-events.service";

type HttpRequest<TBody> = {
    body: TBody;
};

type HttpReply = {
    code: (statusCode: number) => { send: (payload: unknown) => void };
};

export async function ingestLoginEventController(
    request: HttpRequest<LoginEvent>,
    reply: HttpReply,
): Promise<void> {
    const event = normalizeLoginEvent(request.body);

    reply.code(202).send({ accepted: true, event });
}
