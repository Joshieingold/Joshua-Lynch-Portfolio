JsonValue::Object JsonParser::handle_object() {
    JsonValue::Object output{};
    consume('{', "Expected an opening brace");

    while (!try_consume('}')) {
        whitespace();
        auto key{handle_string()};
        whitespace();
        consume(':', "Expected colon seperator between key value pair");
        whitespace();
        auto value{parse()};
        whitespace();

        output.insert({key, value});
        if (is_at_end() || !try_consume(',')) {
            consume('}', "Expected a closing brace");
            break;
        }
    }
    return output;
}
