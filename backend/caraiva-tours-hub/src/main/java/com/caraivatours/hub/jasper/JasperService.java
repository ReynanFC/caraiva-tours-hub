package com.caraivatours.hub.jasper;

import com.caraivatours.hub.shared.exceptions.JasperPdfExportException;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;


/** Exports a filled Jasper report to an in-memory PDF resource suitable for an HTTP response. */
@Service
@Slf4j
public class JasperService {

    public Resource generatePdfResource(JasperPrint print) {
        log.debug("Exporting JasperPrint to PDF Resource...");
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            JasperExportManager.exportReportToPdfStream(print, outputStream);

            byte[] bytes = outputStream.toByteArray();
            log.debug("PDF exported successfully. Size: {} bytes", bytes.length);
            return new ByteArrayResource(bytes);
        } catch (Exception e) {
            log.error("Error during PDF export process: {}", e.getMessage());
            throw new JasperPdfExportException("Error exporting Jasper report to PDF", e);
        }
    }
}
