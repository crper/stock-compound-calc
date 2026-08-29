/**
 * 底部内容组件 - 统一的页脚布局和样式
 * 包含版权信息、免责声明和社交链接
 */
import { Row, Col, Flex } from "antd";
import { useTranslation } from "react-i18next";

export const FooterContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-8">
      {/* 主要内容区域 */}
      <Row justify="center" align="middle" className="mb-4">
        <Col xs={24} sm={20} md={16} lg={14} xl={12}>
          <Flex vertical gap="small" className="text-center">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {t("common.footer.copyright")}
            </div>
            {/* footer 底色为灰底，gray-500 在此仅有 4.49:1，差一点点达不到 AA */}
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              {t("common.footer.disclaimer")}
            </div>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

FooterContent.displayName = "FooterContent";
