"use client";

import { Form, Input, Button, Card, Typography, notification } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/app/auth/AuthContext";

export default function AdminLoginPage() {
  const { loginAsAdmin } = useAuth();
  const router = useRouter();

  const onFinish = () => {
    loginAsAdmin();
    notification.success({
      title: "Logado como admin",
      description: "Você agora tem acesso à gestão de pedidos e produtos.",
      placement: "bottomRight",
    });
    router.push("/orders-management");
  };

  return (
    <main className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Typography.Title level={3} className="text-center mb-6">
          Login do administrador
        </Typography.Title>

        <Typography.Paragraph className="text-center text-gray-600 mb-4">
          Este é um protótipo. Qualquer combinação de usuário e senha será
          aceita para entrar como admin.
        </Typography.Paragraph>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Usuário" name="username">
            <Input placeholder="Digite qualquer usuário" autoComplete="off" />
          </Form.Item>

          <Form.Item label="Senha" name="password">
            <Input.Password placeholder="Digite qualquer senha" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" block>
              Entrar como admin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  );
}

