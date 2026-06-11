import { Document, Page, View, Text, Image as PdfImage, StyleSheet } from "@react-pdf/renderer";
import type { QuotationWithItems } from "@/types/quotation";

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375" preserveAspectRatio="xMidYMid meet">
  <path fill="#7c3aed" d="M374.714844 107.667969C374.71875 107.351562 374.6875 107.039062 374.628906 106.730469C374.566406 106.417969 374.476562 106.117188 374.359375 105.828125C374.238281 105.535156 374.089844 105.257812 373.917969 104.996094C373.742188 104.734375 373.542969 104.488281 373.320312 104.265625C373.097656 104.042969 372.855469 103.84375 372.59375 103.667969C372.332031 103.492188 372.054688 103.347656 371.761719 103.226562C371.472656 103.105469 371.171875 103.015625 370.859375 102.953125C370.550781 102.894531 370.238281 102.863281 369.921875 102.863281L272.894531 102.863281L272.894531 7.605469L272.882812 7.605469C272.886719 7.289062 272.855469 6.976562 272.796875 6.667969C272.738281 6.355469 272.648438 6.054688 272.527344 5.765625C272.410156 5.472656 272.261719 5.195312 272.089844 4.933594C271.914062 4.667969 271.714844 4.425781 271.492188 4.203125C271.269531 3.980469 271.027344 3.78125 270.765625 3.605469C270.503906 3.429688 270.226562 3.28125 269.933594 3.160156C269.640625 3.042969 269.339844 2.949219 269.03125 2.890625C268.722656 2.832031 268.410156 2.800781 268.09375 2.800781L163.183594 2.800781C162.546875 2.800781 161.9375 2.925781 161.347656 3.167969C160.761719 3.410156 160.242188 3.757812 159.792969 4.207031L106.53125 57.386719C106.070312 57.710938 105.679688 58.101562 105.355469 58.5625L3.535156 160.222656C2.847656 160.660156 2.304688 161.238281 1.914062 161.953125C1.519531 162.671875 1.324219 163.4375 1.324219 164.253906L1.324219 267.007812C1.324219 267.324219 1.355469 267.636719 1.414062 267.945312C1.476562 268.253906 1.566406 268.554688 1.6875 268.847656C1.808594 269.136719 1.957031 269.414062 2.132812 269.675781C2.308594 269.9375 2.507812 270.179688 2.730469 270.402344C2.953125 270.628906 3.195312 270.824219 3.457031 271C3.71875 271.175781 3.996094 271.324219 4.289062 271.445312C4.578125 271.566406 4.878906 271.65625 5.1875 271.71875C5.496094 271.777344 5.808594 271.8 6.121094 271.800781L107.234375 271.800781L107.234375 368.433594C107.234375 368.746094 107.265625 369.058594 107.324219 369.367188C107.386719 369.675781 107.476562 369.976562 107.597656 370.269531C107.714844 370.5625 107.863281 370.839844 108.035156 371.101562C108.210938 371.367188 108.410156 371.609375 108.632812 371.832031C108.855469 372.054688 109.097656 372.253906 109.359375 372.429688C109.621094 372.605469 109.898438 372.753906 110.191406 372.875C110.484375 372.996094 110.785156 373.089844 111.09375 373.148438C111.402344 373.207031 111.714844 373.238281 112.03125 373.238281L217.121094 373.238281C217.757812 373.238281 218.367188 373.113281 218.957031 372.871094C219.542969 372.628906 220.0625 372.28125 220.511719 371.832031L273.773438 318.652344C274.234375 318.328125 274.625 317.9375 274.949219 317.476562L376.769531 215.816406C377.457031 215.378906 378 214.800781 378.390625 214.085938C378.785156 213.367188 378.980469 212.601562 378.980469 211.785156L378.980469 108.03125C378.980469 107.714844 378.949219 107.402344 378.890625 107.09375C378.828125 106.785156 378.738281 106.484375 378.617188 106.191406C378.496094 105.902344 378.347656 105.625 378.175781 105.363281C378.003906 105.097656 377.804688 104.855469 377.582031 104.632812C377.359375 104.410156 377.117188 104.210938 376.855469 104.035156C376.59375 103.859375 376.316406 103.710938 376.023438 103.589844C375.730469 103.472656 375.429688 103.378906 375.121094 103.320312C374.8125 103.261719 374.5 103.230469 374.183594 103.230469L374.183594 103.230469L374.714844 107.667969Z"/>
  <path fill="#35ff45" d="M114.078125 66.121094L207.640625 66.121094L207.640625 159.457031L114.078125 159.457031Z"/>
  <path fill="#35ff45" d="M114.078125 271.804688L207.640625 271.804688L207.640625 365.195312L114.078125 365.195312Z"/>
  <path fill="#06b6d4" d="M104.472656 159.453125L17.898438 159.453125L104.472656 73.011719Z"/>
  <path fill="#06b6d4" d="M263.292969 105.703125L217.246094 152.527344L217.246094 64.542969L263.292969 19.09375Z"/>
  <path fill="#06b6d4" d="M305.410156 271.804688L217.246094 358.542969L217.246094 271.804688Z"/>
  <path fill="#06b6d4" d="M313.710938 159.453125L223.898438 159.453125L270.105469 112.46875L358.675781 112.46875Z"/>
  <path fill="#06b6d4" d="M165.171875 12.40625L256.394531 12.40625L211.703125 56.519531L120.992188 56.519531Z"/>
  <path fill="#06b6d4" d="M320.5625 256.902344L320.5625 166.183594L365.113281 119.628906L365.113281 213.074219Z"/>
  <path fill="#ffffff" d="M114.078125 169.058594L207.640625 169.058594L207.640625 262.203125L114.078125 262.203125Z"/>
  <path fill="#35ff45" d="M217.246094 169.058594L310.792969 169.058594L310.792969 262.203125L217.246094 262.203125Z"/>
  <path fill="#35ff45" d="M10.925781 169.058594L104.472656 169.058594L104.472656 262.203125L10.925781 262.203125Z"/>
</svg>`;
const logoDataUrl = `data:image/svg+xml;base64,${typeof window !== "undefined" ? window.btoa(logoSvg) : Buffer.from(logoSvg).toString("base64")}`;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f8fafc",
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937",
  },
  header: {
    marginBottom: 20,
  },
  headerBackground: {
    backgroundColor: "#312e81",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 12,
  },
  headerTextLight: {
    color: "#ffffff",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 8,
    color: "#d1d5db",
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 6,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  brandColumn: {
    marginLeft: 0,
  },
  footerLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 4,
  },
  quoteNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  quoteType: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 6,
    color: "#6d28d9",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 18,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  panel: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
  },
  panelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  panelLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  panelValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
    marginBottom: 6,
  },
  headerCell: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  cellDescription: {
    flex: 3,
    fontSize: 9,
    color: "#111827",
  },
  cellSmall: {
    flex: 1,
    fontSize: 9,
    color: "#111827",
    textAlign: "right",
  },
  totals: {
    flexDirection: "column",
    alignSelf: "flex-end",
    width: "40%",
    marginTop: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 9,
    color: "#4b5563",
  },
  totalValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
  },
  grandTotalBox: {
    marginTop: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 10,
    padding: 10,
  },
  grandTotalLabel: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 4,
  },
  grandTotalValue: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "bold",
  },
  notes: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 18,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#6b7280",
  },
});

const formatCurrency = (value?: number | null, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value ?? 0);

export function QuotationPdfDocument({ quote }: { quote: QuotationWithItems }) {
  const items = quote.items ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerBackground}>
            <View style={styles.headerTop}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <PdfImage style={styles.logo} src={logoDataUrl} />
                <View style={styles.brandColumn}>
                  <Text style={styles.headerTitle}>THE WEB START</Text>
                  <Text style={styles.headerSubtitle}>thewebstart.in · info@thewebstart.in</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.quoteNumber, styles.headerTextLight]}>{quote.quote_no}</Text>
                <Text style={[styles.quoteType, styles.headerTextLight]}>{quote.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: quote.status === "accepted" ? "#10b981" : quote.status === "rejected" ? "#ef4444" : "#8b5cf6" }]}> 
                  <Text style={styles.statusText}>{quote.status?.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionRow}>
            <View style={styles.panel}>
              <View style={styles.panelRow}>
                <Text style={styles.panelLabel}>Prepared For</Text>
                <Text style={styles.panelValue}>{quote.client_name ?? "-"}</Text>
              </View>
              {quote.client_company ? (
                <View style={styles.panelRow}>
                  <Text style={styles.panelLabel}>Company</Text>
                  <Text style={styles.panelValue}>{quote.client_company}</Text>
                </View>
              ) : null}
              {quote.client_email ? (
                <View style={styles.panelRow}>
                  <Text style={styles.panelLabel}>Email</Text>
                  <Text style={styles.panelValue}>{quote.client_email}</Text>
                </View>
              ) : null}
              {quote.client_phone ? (
                <View style={styles.panelRow}>
                  <Text style={styles.panelLabel}>Phone</Text>
                  <Text style={styles.panelValue}>{quote.client_phone}</Text>
                </View>
              ) : null}
              {quote.client_address ? (
                <View style={styles.panelRow}>
                  <Text style={styles.panelLabel}>Address</Text>
                  <Text style={styles.panelValue}>{quote.client_address}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.panel}>
              <View style={styles.panelRow}>
                <Text style={styles.panelLabel}>Valid Until</Text>
                <Text style={styles.panelValue}>{quote.valid_until ?? "-"}</Text>
              </View>
              <View style={styles.panelRow}>
                <Text style={styles.panelLabel}>Currency</Text>
                <Text style={styles.panelValue}>{quote.currency}</Text>
              </View>
              <View style={styles.panelRow}>
                <Text style={styles.panelLabel}>Status</Text>
                <Text style={styles.panelValue}>{quote.status}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 0.35 }]}>#</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Description</Text>
            <Text style={[styles.headerCell, { flex: 0.5, textAlign: "right" }]}>Qty</Text>
            <Text style={[styles.headerCell, { flex: 0.8, textAlign: "right" }]}>Unit Price</Text>
            <Text style={[styles.headerCell, { flex: 0.7, textAlign: "right" }]}>Amount</Text>
          </View>
          {items.length > 0 ? (
            items.map((item, index) => (
              <View style={styles.row} key={`${item.service}-${index}`}>
                <Text style={[styles.cellSmall, { flex: 0.35 }]}>{index + 1}</Text>
                <Text style={[styles.cellDescription, { flex: 2 }]}>{item.service}</Text>
                <Text style={[styles.cellSmall, { flex: 0.5, textAlign: "right" }]}>{item.quantity}</Text>
                <Text style={[styles.cellSmall, { flex: 0.8, textAlign: "right" }]}>{formatCurrency(item.unit_price, quote.currency)}</Text>
                <Text style={[styles.cellSmall, { flex: 0.7, textAlign: "right" }]}>{formatCurrency(item.amount, quote.currency)}</Text>
              </View>
            ))
          ) : (
            <View style={[styles.row, { justifyContent: "center" }]}> 
              <Text style={styles.panelLabel}>No line items found.</Text>
            </View>
          )}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.subtotal, quote.currency)}</Text>
          </View>
          {quote.discount_amount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>- {formatCurrency(quote.discount_amount, quote.currency)}</Text>
            </View>
          )}
          {quote.tax_amount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>{formatCurrency(quote.tax_amount, quote.currency)}</Text>
            </View>
          )}
          <View style={styles.grandTotalBox}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(quote.total, quote.currency)}</Text>
          </View>
        </View>

        {(quote.terms || quote.notes) && (
          <View style={styles.section}>
            {quote.terms ? <Text style={styles.notes}>{quote.terms}</Text> : null}
            {quote.notes ? <Text style={[styles.notes, { marginTop: 8 }]}>{quote.notes}</Text> : null}
          </View>
        )}

        <View style={styles.footer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PdfImage style={styles.footerLogo} src={logoDataUrl} />
            <Text style={styles.footerText}>Generated by The Web Start — thewebstart.in</Text>
          </View>
          <Text style={styles.footerText}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}
