/**
 * 底部内容组件 - 统一的页脚布局和样式
 * 包含版权信息、免责声明和社交链接
 */
import { Row, Col, Space, Flex } from "antd";
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
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              {t("common.footer.disclaimer")}
            </div>
          </Flex>
        </Col>
      </Row>

      {/* 次要信息区域 */}
      <Row justify="center" align="middle" className="text-gray-500 dark:text-gray-400 text-xs">
        <Col xs={24} sm={20} md={16} lg={14} xl={12}>
          <Space size="small">
            <span> {/* 版本号占位 */} </span>
            <span>|</span>
            <span> {/* 构建时间占位 */} </span>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

FooterContent.displayName = "FooterContent";
