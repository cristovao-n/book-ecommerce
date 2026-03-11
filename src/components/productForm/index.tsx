"use client";

import { Button, Form, Input, InputNumber } from "antd";
import { Product } from "@/src/types/types";

export type ProductFormValues = Omit<Product, "id"> & { tagsText: string };

function tagsArrayToText(tags: string[]) {
  return tags.join(", ");
}

export function parseTagsText(tagsText: string): string[] {
  return tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ProductForm({
  initialValues,
  submitText,
  onSubmit,
}: {
  initialValues?: Omit<Product, "id">;
  submitText: string;
  onSubmit: (values: Omit<Product, "id">) => void;
}) {
  const [form] = Form.useForm<ProductFormValues>();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={
        initialValues
          ? { ...initialValues, tagsText: tagsArrayToText(initialValues.tags) }
          : {
              nome: "",
              descricao: "",
              imagem: "",
              preco: 0,
              categoria: "",
              tagsText: "",
              tags: [],
            }
      }
      onFinish={(values) => {
        onSubmit({
          nome: values.nome,
          descricao: values.descricao,
          imagem: values.imagem,
          preco: Number(values.preco),
          categoria: values.categoria,
          tags: parseTagsText(values.tagsText),
        });
      }}
    >
      <Form.Item
        label="Nome"
        name="nome"
        rules={[{ required: true, message: "Informe o nome" }]}
      >
        <Input placeholder="Nome do produto" />
      </Form.Item>

      <Form.Item
        label="Descrição"
        name="descricao"
        rules={[{ required: true, message: "Informe a descrição" }]}
      >
        <Input.TextArea rows={4} placeholder="Descrição do produto" />
      </Form.Item>

      <Form.Item
        label="Imagem (URL)"
        name="imagem"
        rules={[{ required: true, message: "Informe a URL da imagem" }]}
      >
        <Input placeholder="https://..." />
      </Form.Item>

      <Form.Item
        label="Preço"
        name="preco"
        rules={[{ required: true, message: "Informe o preço" }]}
      >
        <InputNumber
          min={0}
          step={0.01}
          style={{ width: "100%" }}
          stringMode
        />
      </Form.Item>

      <Form.Item
        label="Categoria"
        name="categoria"
        rules={[{ required: true, message: "Informe a categoria" }]}
      >
        <Input placeholder="Ex: Tecnologia" />
      </Form.Item>

      <Form.Item label="Tags (separadas por vírgula)" name="tagsText">
        <Input placeholder="ex: javascript, web, frontend" />
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button type="primary" htmlType="submit">
          {submitText}
        </Button>
      </div>
    </Form>
  );
}

