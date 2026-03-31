import { describe, it, expect } from "vitest";
import {
  normalizeLink,
  decodeEntities,
  stripHtml,
  extractTag,
  parseRSS,
} from "@/lib/blog-utils";

describe("blog-utils", () => {
  describe("normalizeLink", () => {
    it("http를 https로 변환한다", () => {
      expect(normalizeLink("http://example.com/1")).toBe("https://example.com/1");
    });

    it("후행 슬래시를 제거한다", () => {
      expect(normalizeLink("https://example.com/1/")).toBe("https://example.com/1");
      expect(normalizeLink("https://example.com/1///")).toBe("https://example.com/1");
    });

    it("이미 https인 URL은 변경하지 않는다", () => {
      expect(normalizeLink("https://example.com/1")).toBe("https://example.com/1");
    });
  });

  describe("decodeEntities", () => {
    it("HTML 엔티티를 디코딩한다", () => {
      expect(decodeEntities("&lt;p&gt;hello&lt;/p&gt;")).toBe("<p>hello</p>");
      expect(decodeEntities("&quot;test&quot;")).toBe('"test"');
      expect(decodeEntities("it&#39;s")).toBe("it's");
      expect(decodeEntities("a &amp; b")).toBe("a & b");
    });

    it("엔티티가 없으면 원본을 반환한다", () => {
      expect(decodeEntities("hello world")).toBe("hello world");
    });
  });

  describe("stripHtml", () => {
    it("HTML 태그를 제거하고 텍스트만 남긴다", () => {
      expect(stripHtml("<p>hello <b>world</b></p>")).toBe("hello world");
    });

    it("연속 공백을 하나로 축소한다", () => {
      expect(stripHtml("<p>hello</p>   <p>world</p>")).toBe("hello world");
    });

    it("HTML 엔티티도 함께 디코딩한다", () => {
      expect(stripHtml("<p>&amp; test</p>")).toBe("& test");
    });
  });

  describe("extractTag", () => {
    it("일반 태그의 내용을 추출한다", () => {
      const xml = "<title>Hello World</title>";
      expect(extractTag(xml, "title")).toBe("Hello World");
    });

    it("CDATA 섹션의 내용을 추출한다", () => {
      const xml = "<description><![CDATA[Some <b>content</b>]]></description>";
      expect(extractTag(xml, "description")).toBe("Some <b>content</b>");
    });

    it("태그가 없으면 빈 문자열을 반환한다", () => {
      expect(extractTag("<item></item>", "title")).toBe("");
    });

    it("내용 앞뒤 공백을 제거한다", () => {
      expect(extractTag("<title>  Hello  </title>", "title")).toBe("Hello");
    });
  });

  describe("parseRSS", () => {
    it("RSS XML에서 포스트 목록을 추출한다", () => {
      const xml = `
        <rss>
          <channel>
            <item>
              <title>Post 1</title>
              <link>https://example.com/1</link>
              <description>First post description</description>
              <pubDate>Mon, 01 Jan 2024 00:00:00 +0900</pubDate>
            </item>
            <item>
              <title>Post 2</title>
              <link>https://example.com/2</link>
              <description>Second post</description>
              <pubDate>Tue, 02 Jan 2024 00:00:00 +0900</pubDate>
            </item>
          </channel>
        </rss>
      `;
      const posts = parseRSS(xml);
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe("Post 1");
      expect(posts[0].link).toBe("https://example.com/1");
      expect(posts[1].title).toBe("Post 2");
    });

    it("빈 RSS는 빈 배열을 반환한다", () => {
      expect(parseRSS("<rss><channel></channel></rss>")).toEqual([]);
    });

    it("description을 120자로 자른다", () => {
      const longDesc = "A".repeat(200);
      const xml = `<rss><channel><item>
        <title>T</title><link>L</link>
        <description>${longDesc}</description>
        <pubDate>D</pubDate>
      </item></channel></rss>`;
      const posts = parseRSS(xml);
      expect(posts[0].description.length).toBeLessThanOrEqual(120);
    });
  });
});
