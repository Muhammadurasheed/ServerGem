"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // webview/main.tsx
  var import_react4 = __toESM(__require("react"));
  var import_client = __toESM(__require("react-dom/client"));

  // webview/App.tsx
  var import_react3 = __require("react");

  // webview/store/useApiStore.ts
  var import_zustand = __require("zustand");

  // src/types.ts
  var HttpMethod = /* @__PURE__ */ ((HttpMethod2) => {
    HttpMethod2["GET"] = "GET";
    HttpMethod2["POST"] = "POST";
    HttpMethod2["PUT"] = "PUT";
    HttpMethod2["DELETE"] = "DELETE";
    HttpMethod2["PATCH"] = "PATCH";
    HttpMethod2["HEAD"] = "HEAD";
    HttpMethod2["OPTIONS"] = "OPTIONS";
    return HttpMethod2;
  })(HttpMethod || {});

  // webview/vscode.ts
  var vscode = acquireVsCodeApi();

  // webview/store/useApiStore.ts
  var initialState = vscode.getState() || {
    method: "GET" /* GET */,
    url: "https://jsonplaceholder.typicode.com/todos/1",
    params: [{ id: "1", key: "", value: "", enabled: true }],
    headers: [{ id: "1", key: "", value: "", enabled: true }],
    body: JSON.stringify({ message: "Hello, ServerGem!" }, null, 2),
    response: null,
    error: null,
    loading: false,
    activeRequestTab: "params",
    activeResponseTab: "body",
    aiResponse: "",
    aiLoading: false,
    apiKeyChecked: false,
    hasApiKey: true
  };
  var useApiStore = (0, import_zustand.create)()((set, get) => ({
    ...initialState,
    setMethod: (method) => {
      const hasBody = ["POST", "PUT", "PATCH"].includes(method);
      set({ method });
      if (!hasBody && get().activeRequestTab === "body") {
        set({ activeRequestTab: "params" });
      }
    },
    setUrl: (url) => set({ url }),
    setParams: (params) => set({ params }),
    setHeaders: (headers) => set({ headers }),
    setBody: (body) => set({ body }),
    setActiveRequestTab: (tab) => set({ activeRequestTab: tab }),
    setActiveResponseTab: (tab) => set({ activeResponseTab: tab }),
    setApiKeyChecked: (checked) => set({ apiKeyChecked: checked }),
    setHasApiKey: (has) => set({ hasApiKey: has }),
    sendRequest: async () => {
      set({ loading: true, response: null, error: null, aiResponse: "", aiLoading: false, activeResponseTab: "body" });
      const { method, url, params, headers, body } = get();
      vscode.postMessage({ command: "sendRequest", payload: { method, url, params, headers, body } });
    },
    // Actions to be called by the message handler
    handleResponse: (response) => set({ response, loading: false, error: null }),
    handleError: (error) => set({ error, response: error.response || null, loading: false, activeResponseTab: "ai", aiLoading: true, aiResponse: "" }),
    handleAiChunk: (chunk) => set((state) => ({ aiResponse: state.aiResponse + chunk })),
    handleAiComplete: () => set({ aiLoading: false })
  }));
  useApiStore.subscribe((state) => {
    const stateToSave = { ...state };
    vscode.setState(stateToSave);
  });

  // webview/components/KeyValueEditor.tsx
  var import_jsx_runtime = __require("react/jsx-runtime");
  var KeyValueEditor = ({ items, onChange }) => {
    const handleItemChange = (id, field, value) => {
      const newItems = items.map(
        (item) => item.id === id ? { ...item, [field]: value } : item
      );
      onChange(newItems);
    };
    const addItem = () => {
      onChange([...items, { id: Date.now().toString(), key: "", value: "", enabled: true }]);
    };
    const removeItem = (id) => {
      if (items.length > 1) {
        onChange(items.filter((item) => item.id !== id));
      } else {
        onChange([{ id: Date.now().toString(), key: "", value: "", enabled: true }]);
      }
    };
    const handleKeyDown = (e, id) => {
      if (e.key === "Enter") {
        const currentIndex = items.findIndex((item) => item.id === id);
        if (currentIndex === items.length - 1) {
          addItem();
        }
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "checkbox",
            checked: item.enabled,
            onChange: (e) => handleItemChange(item.id, "enabled", e.target.checked),
            className: "form-checkbox h-4 w-4 text-gem-accent bg-gem-bg border-gem-border rounded focus:ring-gem-accent"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "text",
            placeholder: "Key",
            value: item.key,
            onChange: (e) => handleItemChange(item.id, "key", e.target.value),
            className: "flex-grow bg-gem-bg border border-gem-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gem-accent"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "text",
            placeholder: "Value",
            value: item.value,
            onChange: (e) => handleItemChange(item.id, "value", e.target.value),
            onKeyDown: (e) => handleKeyDown(e, item.id),
            className: "flex-grow bg-gem-bg border border-gem-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gem-accent"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => removeItem(item.id),
            className: "text-gem-text-secondary hover:text-gem-red p-1 rounded-md",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ] }, item.id)),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: addItem,
          className: "text-sm text-gem-accent hover:text-gem-accent-hover",
          children: "+ Add Row"
        }
      )
    ] });
  };
  var KeyValueEditor_default = KeyValueEditor;

  // webview/components/BodyEditor.tsx
  var import_jsx_runtime2 = __require("react/jsx-runtime");
  var BodyEditor = ({ value, onChange }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "textarea",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: "Enter request body (e.g., JSON)",
        className: "w-full h-48 bg-gem-bg border border-gem-border rounded-md p-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gem-accent resize-y"
      }
    ) });
  };
  var BodyEditor_default = BodyEditor;

  // webview/components/RequestConfigTabs.tsx
  var import_jsx_runtime3 = __require("react/jsx-runtime");
  var RequestConfigTabs = () => {
    const { activeRequestTab, setActiveRequestTab, params, setParams, headers, setHeaders, body, setBody, method } = useApiStore();
    const tabs = [
      { name: "Params", id: "params" },
      { name: "Headers", id: "headers" },
      { name: "Body", id: "body" }
    ];
    const hasBody = ["POST", "PUT", "PATCH"].includes(method);
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "border-b border-gem-border", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("nav", { className: "-mb-px flex space-x-4 px-4", "aria-label": "Tabs", children: tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          onClick: () => setActiveRequestTab(tab.id),
          disabled: tab.id === "body" && !hasBody,
          className: `${activeRequestTab === tab.id ? "border-gem-accent text-gem-accent" : "border-transparent text-gem-text-secondary hover:text-gem-text hover:border-gem-text-secondary"}
              ${tab.id === "body" && !hasBody ? "opacity-50 cursor-not-allowed" : ""}
              whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`,
          children: tab.name
        },
        tab.name
      )) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "p-4", children: [
        activeRequestTab === "params" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(KeyValueEditor_default, { items: params, onChange: setParams }),
        activeRequestTab === "headers" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(KeyValueEditor_default, { items: headers, onChange: setHeaders }),
        activeRequestTab === "body" && hasBody && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(BodyEditor_default, { value: body, onChange: setBody }),
        activeRequestTab === "body" && !hasBody && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "text-center text-gem-text-secondary text-sm p-8", children: [
          "The ",
          method,
          " method does not have a request body."
        ] })
      ] })
    ] });
  };
  var RequestConfigTabs_default = RequestConfigTabs;

  // webview/components/icons.tsx
  var import_jsx_runtime4 = __require("react/jsx-runtime");
  var SendIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m22 2-7 20-4-9-9-4Z" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M22 2 11 13" })
      ]
    }
  );
  var LogoIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" })
    }
  );
  var AiSparkleIcon = (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M9.5 2.5a2.5 2.5 0 0 1 5 0" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M6.2 5a4 4 0 0 1 11.6 0" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M5 11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M19 11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M10 17a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M14 17a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M12 2v2" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M12 10v1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M12 16v1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m4.929 4.929 1.414 1.414" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m17.657 4.929 1.414-1.414" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m4.929 17.657 1.414-1.414" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m17.657 17.657 1.414 1.414" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M2 12h2" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M10 12h1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M13 12h1" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M20 12h2" })
      ]
    }
  );

  // webview/components/RequestPanel.tsx
  var import_jsx_runtime5 = __require("react/jsx-runtime");
  var RequestPanel = () => {
    const method = useApiStore((state) => state.method);
    const setMethod = useApiStore((state) => state.setMethod);
    const url = useApiStore((state) => state.url);
    const setUrl = useApiStore((state) => state.setUrl);
    const sendRequest = useApiStore((state) => state.sendRequest);
    const loading = useApiStore((state) => state.loading);
    const handleSend = () => {
      if (!loading) {
        sendRequest();
      }
    };
    const handleUrlKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSend();
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "bg-gem-panel border border-gem-border rounded-lg flex flex-col h-full overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "p-2 flex items-center gap-2 border-b border-gem-border flex-shrink-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "select",
          {
            value: method,
            onChange: (e) => setMethod(e.target.value),
            className: "bg-gem-bg border border-gem-border rounded-md px-3 py-2 text-gem-text focus:outline-none focus:ring-2 focus:ring-gem-accent",
            children: Object.values(HttpMethod).map((m) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: m, children: m }, m))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "input",
          {
            type: "text",
            value: url,
            onChange: (e) => setUrl(e.target.value),
            onKeyDown: handleUrlKeyDown,
            placeholder: "https://api.example.com/data",
            className: "flex-grow bg-gem-bg border border-gem-border rounded-md px-3 py-2 text-gem-text focus:outline-none focus:ring-2 focus:ring-gem-accent"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "button",
          {
            onClick: handleSend,
            disabled: loading,
            className: "flex items-center gap-2 bg-gem-accent text-white font-bold py-2 px-4 rounded-md hover:bg-gem-accent-hover disabled:bg-gem-text-secondary disabled:cursor-not-allowed transition-colors",
            children: loading ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              "Sending..."
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SendIcon, { className: "w-5 h-5" }),
              "Send"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex-grow overflow-y-auto", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(RequestConfigTabs_default, {}) })
    ] });
  };
  var RequestPanel_default = RequestPanel;

  // webview/components/AiAnalysis.tsx
  var import_react = __toESM(__require("react"));
  var import_jsx_runtime6 = __require("react/jsx-runtime");
  var MarkdownRenderer = ({ content }) => {
    const lines = content.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let listType = null;
    let listItems = [];
    const flushList = (key) => {
      if (listItems.length > 0) {
        const ListTag = listType === "ol" ? "ol" : "ul";
        const listStyle = listType === "ol" ? "list-decimal" : "list-disc";
        elements.push(
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ListTag, { className: `ml-6 ${listStyle}`, children: listItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("li", { children: item }, index)) }, `list-${key}`)
        );
        listItems = [];
      }
      listType = null;
    };
    const flushCodeBlock = (key) => {
      if (codeBlockContent.length > 0) {
        elements.push(
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("pre", { className: "bg-gem-bg text-gem-text p-3 my-2 rounded-md overflow-x-auto text-sm", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("code", { children: codeBlockContent.join("\n") }) }, `cb-${key}`)
        );
        codeBlockContent = [];
      }
    };
    const parseInline = (line, key) => {
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react.default.Fragment, { children: parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: part.slice(2, -2) }, j);
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("code", { className: "bg-gem-bg px-1 py-0.5 rounded text-gem-orange", children: part.slice(1, -1) }, j);
        }
        return part;
      }) }, key);
    };
    lines.forEach((line, i) => {
      if (line.startsWith("```")) {
        flushList(i);
        if (inCodeBlock) {
          flushCodeBlock(i);
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      const isUl = line.match(/^\s*[-*]\s/);
      const isOl = line.match(/^\s*\d+\.\s/);
      if (!isUl && !isOl)
        flushList(`pre-${i}`);
      if (line.startsWith("### ")) {
        elements.push(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { className: "text-md font-bold mt-3 mb-1", children: parseInline(line.substring(4), i) }, i));
      } else if (line.startsWith("## ")) {
        elements.push(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { className: "text-lg font-bold mt-4 mb-2", children: parseInline(line.substring(3), i) }, i));
      } else if (line.startsWith("# ")) {
        elements.push(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { className: "text-xl font-bold mt-4 mb-2", children: parseInline(line.substring(2), i) }, i));
      } else if (isUl) {
        if (listType !== "ul")
          flushList(`pre-ul-${i}`);
        listType = "ul";
        listItems.push(line.replace(/^\s*[-*]\s/, ""));
      } else if (isOl) {
        if (listType !== "ol")
          flushList(`pre-ol-${i}`);
        listType = "ol";
        listItems.push(line.replace(/^\s*\d+\.\s/, ""));
      } else if (line.trim() !== "") {
        elements.push(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "my-1", children: parseInline(line, i) }, i));
      }
    });
    flushList("end");
    flushCodeBlock("end");
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: elements });
  };
  var AiAnalysis = () => {
    const aiResponse = useApiStore((state) => state.aiResponse);
    const aiLoading = useApiStore((state) => state.aiLoading);
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "text-sm", children: [
      aiLoading && !aiResponse && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center text-gem-text-secondary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "w-4 h-4 border-2 border-gem-text-secondary border-t-transparent rounded-full animate-spin mr-2" }),
        "Gemini is analyzing the error..."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "space-y-2 prose prose-invert text-gem-text max-w-none", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MarkdownRenderer, { content: aiResponse }),
        aiLoading && aiResponse && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "w-2 h-2 bg-gem-accent rounded-full animate-pulse ml-1 mt-2" })
      ] })
    ] });
  };
  var AiAnalysis_default = AiAnalysis;

  // webview/components/ResponsePanel.tsx
  var import_jsx_runtime7 = __require("react/jsx-runtime");
  var ResponsePanel = () => {
    const response = useApiStore((state) => state.response);
    const error = useApiStore((state) => state.error);
    const loading = useApiStore((state) => state.loading);
    const activeResponseTab = useApiStore((state) => state.activeResponseTab);
    const setActiveResponseTab = useApiStore((state) => state.setActiveResponseTab);
    const hasApiKey = useApiStore((state) => state.hasApiKey);
    const renderContent = () => {
      if (loading) {
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-center h-full text-gem-text-secondary", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "w-6 h-6 border-2 border-gem-text-secondary border-t-transparent rounded-full animate-spin mr-2" }),
          "Sending Request..."
        ] });
      }
      if (!response && !error) {
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-gem-text-secondary text-center p-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(LogoIcon, { className: "w-12 h-12 mb-4 text-gem-text-secondary" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h2", { className: "text-lg font-semibold text-gem-text", children: "Welcome to ServerGem" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { children: "Send a request to see the response here." })
        ] });
      }
      const displayData = response?.data;
      const isError = !!error;
      const status = response?.status || 0;
      const tabs = [
        { name: "Body", id: "body" },
        { name: "Headers", id: "headers" },
        { name: "AI Analysis", id: "ai", isErrorTab: true }
      ];
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "p-2 flex items-center justify-between border-b border-gem-border flex-wrap flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: `font-bold ${status >= 400 ? "text-gem-red" : status >= 200 && status < 300 ? "text-gem-green" : "text-gem-orange"}`, children: [
            "Status: ",
            status,
            " ",
            response?.statusText
          ] }),
          response?.time != null && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-gem-text-secondary", children: [
            "Time: ",
            response.time,
            "ms"
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "border-b border-gem-border flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("nav", { className: "-mb-px flex space-x-4 px-4", "aria-label": "Tabs", children: tabs.map((tab) => (!tab.isErrorTab || isError && hasApiKey) && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            onClick: () => setActiveResponseTab(tab.id),
            className: `${activeResponseTab === tab.id ? "border-gem-accent text-gem-accent" : "border-transparent text-gem-text-secondary hover:text-gem-text hover:border-gem-text-secondary"} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-1`,
            children: [
              tab.id === "ai" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(AiSparkleIcon, { className: "w-4 h-4" }),
              tab.name
            ]
          },
          tab.name
        )) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-4 flex-grow overflow-auto", children: [
          activeResponseTab === "body" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: "text-sm bg-gem-bg p-2 rounded-md whitespace-pre-wrap break-all", children: JSON.stringify(displayData, null, 2) }),
          activeResponseTab === "headers" && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { className: "text-sm bg-gem-bg p-2 rounded-md whitespace-pre-wrap break-all", children: JSON.stringify(response?.headers, null, 2) }),
          activeResponseTab === "ai" && isError && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(AiAnalysis_default, {})
        ] })
      ] });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "bg-gem-panel border border-gem-border rounded-lg h-full flex flex-col overflow-hidden", children: renderContent() });
  };
  var ResponsePanel_default = ResponsePanel;

  // webview/hooks/useMessageHandler.ts
  var import_react2 = __require("react");
  var useMessageHandler = () => {
    const { handleResponse, handleError, handleAiChunk, handleAiComplete } = useApiStore.getState();
    (0, import_react2.useEffect)(() => {
      const handleMessage = (event) => {
        const message = event.data;
        switch (message.command) {
          case "response":
            handleResponse(message.payload);
            break;
          case "error":
            handleError(message.payload);
            break;
          case "aiResponseChunk":
            handleAiChunk(message.payload);
            break;
          case "aiResponseComplete":
            handleAiComplete();
            break;
        }
      };
      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }, [handleResponse, handleError, handleAiChunk, handleAiComplete]);
  };

  // webview/App.tsx
  var import_jsx_runtime8 = __require("react/jsx-runtime");
  var App = () => {
    useMessageHandler();
    const [hasApiKey, setHasApiKey] = (0, import_react3.useState)(true);
    const apiKeyChecked = useApiStore((state) => state.apiKeyChecked);
    const setApiKeyChecked = useApiStore((state) => state.setApiKeyChecked);
    const setHasApiKeyStore = useApiStore((state) => state.setHasApiKey);
    (0, import_react3.useEffect)(() => {
      if (!apiKeyChecked) {
        vscode.postMessage({ command: "checkApiKey" });
        setApiKeyChecked(true);
      }
    }, [apiKeyChecked, setApiKeyChecked]);
    (0, import_react3.useEffect)(() => {
      const handleMessage = (event) => {
        const message = event.data;
        if (message.command === "apiKeyStatus") {
          setHasApiKey(message.payload.hasApiKey);
          setHasApiKeyStore(message.payload.hasApiKey);
        }
        if (message.command === "apiKeySet") {
          setHasApiKey(true);
          setHasApiKeyStore(true);
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [setHasApiKeyStore]);
    if (!hasApiKey) {
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "bg-gem-bg text-gem-text min-h-screen flex flex-col items-center justify-center p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(LogoIcon, { className: "w-16 h-16 mb-4 text-gem-accent" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h1", { className: "text-2xl font-bold mb-2", children: "Welcome to ServerGem" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-gem-text-secondary mb-6", children: "Please set your Gemini API key to get started." }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "button",
          {
            onClick: () => vscode.postMessage({ command: "openApiKeyPanel" }),
            className: "bg-gem-accent text-white font-bold py-2 px-4 rounded-md hover:bg-gem-accent-hover",
            children: "Set API Key"
          }
        )
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "bg-gem-bg text-gem-text min-h-screen font-sans flex flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("header", { className: "flex items-center p-2 border-b border-gem-border bg-gem-panel flex-shrink-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(LogoIcon, { className: "w-8 h-8 mr-2 text-gem-accent" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h1", { className: "text-xl font-semibold", children: "ServerGem" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-sm text-gem-text-secondary ml-2 mt-1", children: "Your Backend Copilot" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("main", { className: "flex-grow flex flex-col lg:flex-row p-2 gap-2 overflow-hidden", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "lg:w-1/2 flex flex-col min-h-0", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(RequestPanel_default, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "lg:w-1/2 flex flex-col min-h-0", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ResponsePanel_default, {}) })
      ] })
    ] });
  };
  var App_default = App;

  // webview/main.tsx
  var import_jsx_runtime9 = __require("react/jsx-runtime");
  var rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }
  var root = import_client.default.createRoot(rootElement);
  root.render(
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react4.default.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(App_default, {}) })
  );
})();
//# sourceMappingURL=webview.js.map
