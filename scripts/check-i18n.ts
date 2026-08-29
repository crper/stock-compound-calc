#!/usr/bin/env node
import { z } from "zod";
import { zhCN } from "../src/i18n/locales/zh-CN.ts";
import { enUS } from "../src/i18n/locales/en-US.ts";

type TranslationKey = string;
type TranslationPath = string[];

// Object.entries 返回 [string, any][]，用 zod 收窄为 Record<string, unknown> 后再递归
const NestedObjectSchema = z.record(z.string(), z.unknown());

function extractKeys(
  obj: object,
  path: TranslationPath = [],
): Map<TranslationKey, TranslationPath> {
  const keys = new Map<TranslationKey, TranslationPath>();

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key];

    const nested = NestedObjectSchema.safeParse(value);
    if (nested.success) {
      const nestedKeys = extractKeys(nested.data, currentPath);
      nestedKeys.forEach((v, k) => keys.set(k, v));
    } else {
      keys.set(currentPath.join("."), currentPath);
    }
  }

  return keys;
}

function compareTranslations() {
  console.log("检查翻译键一致性...\n");

  const zhKeys = extractKeys(zhCN.translation);
  const enKeys = extractKeys(enUS.translation);

  const missingInZh: TranslationKey[] = [];
  const missingInEn: TranslationKey[] = [];
  const commonKeys: TranslationKey[] = [];

  zhKeys.forEach((_, key) => {
    if (!enKeys.has(key)) {
      missingInZh.push(key);
    } else {
      commonKeys.push(key);
    }
  });

  enKeys.forEach((_, key) => {
    if (!zhKeys.has(key)) {
      missingInEn.push(key);
    }
  });

  console.log("=== 翻译键统计 ===");
  console.log(`中文翻译键数量: ${zhKeys.size}`);
  console.log(`英文翻译键数量: ${enKeys.size}`);
  console.log(`共同翻译键数量: ${commonKeys.length}`);

  if (missingInZh.length > 0) {
    console.log(`\n⚠️  英文存在但中文缺失的翻译键 (${missingInZh.length} 个):`);
    missingInZh.forEach((key) => {
      console.log(`  - ${key}`);
    });
  }

  if (missingInEn.length > 0) {
    console.log(`\n⚠️  中文存在但英文缺失的翻译键 (${missingInEn.length} 个):`);
    missingInEn.forEach((key) => {
      console.log(`  - ${key}`);
    });
  }

  if (missingInZh.length === 0 && missingInEn.length === 0) {
    console.log("\n✅ 所有翻译键在中英文版本中都存在！");
    return 0;
  } else {
    console.log("\n❌ 发现不一致的翻译键！");
    return 1;
  }
}

const exitCode = compareTranslations();
process.exit(exitCode);
