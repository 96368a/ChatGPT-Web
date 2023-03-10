import flask, json
from flask import request
from revChatGPT.V1 import Chatbot
from gevent import pywsgi
from config import config

# 创建一个服务，把当前这个python文件当做一个服务
app = flask.Flask(__name__, static_folder="web/dist")
# chatbot = Chatbot(config)
chatbot = Chatbot(config=config)


def chat(prompt, conversation_id=None, parent_id=None):
    message = ""
    if conversation_id is None and parent_id is None:
        chatbot.reset_chat()
    for data in chatbot.ask(
        prompt, conversation_id=conversation_id, parent_id=parent_id
    ):
        parent_id = data["parent_id"]
        conversation_id = data["conversation_id"]
        message = data["message"]
    response = {
        "message": message,
        "parent_id": parent_id,
        "conversation_id": conversation_id,
    }
    return response


# 对话
@app.route("/ask", methods=["post"])
def chatapi():
    requestJson = request.get_data()
    if requestJson is None or requestJson == "" or requestJson == {}:
        resu = {"code": 1, "msg": "请求内容不能为空"}
        return json.dumps(resu, ensure_ascii=False)
    data = json.loads(requestJson)
    if ("conversation_id" in data) == False:
        data["conversation_id"] = None
    if ("parent_id" in data) == False:
        data["parent_id"] = None
    try:
        msg = chat(data["msg"], data["conversation_id"], data["parent_id"])
    except Exception as error:
        print("接口报错")
        resu = {"code": 1, "msg": "请求异常: " + str(error)}
        return json.dumps(resu, ensure_ascii=False)
    else:
        resu = {"code": 0, "data": msg}
        return json.dumps(resu, ensure_ascii=False)


# 由于逆向工程的接口原因，参数传递都是正确的，但是始终返回的都是所有对话
@app.route("/conversations", methods=["get"])
def get_conversations():
    resu = chatbot.get_conversations(offset=0, limit=100)
    return resu


# 获取历史对话
@app.route("/conversation/<uuid:convo_id>", methods=["get"])
def get_msg_history(convo_id):
    resu = chatbot.get_msg_history(convo_id)
    return resu


# 修改对话标题
@app.route("/conversation/<uuid:convo_id>/title", methods=["post"])
def change_title(convo_id):
    requestJson = request.get_data()
    data = json.loads(requestJson)
    chatbot.change_title(convo_id, data["title"])
    return json.dumps({"code": 0, "msg": "成功: "}, ensure_ascii=False)


# 删除对话
@app.route("/conversation/<uuid:convo_id>/delete", methods=["post"])
def delete_conversation(convo_id):
    chatbot.delete_conversation(convo_id)
    return json.dumps({"code": 0, "msg": "成功: "}, ensure_ascii=False)


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/<path:fallback>")
def fallback(fallback):  # Vue Router 的 mode 为 'hash' 时可移除该方法
    if (
        fallback.startswith("assets/")
        or fallback.startswith("js/")
        or fallback.startswith("img/")
        or fallback == "favicon.ico"
    ):
        return app.send_static_file(fallback)
    else:
        return app.send_static_file("index.html")


if __name__ == "__main__":
    server = pywsgi.WSGIServer(("0.0.0.0", 8000), app)
    server.serve_forever()
