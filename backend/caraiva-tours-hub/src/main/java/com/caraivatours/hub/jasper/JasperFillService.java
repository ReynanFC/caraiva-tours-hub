package com.caraivatours.hub.jasper;

import com.caraivatours.hub.shared.exceptions.JasperReportGenerationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;

/**
 * Loads a compiled Jasper template and fills it against the application data source.
 *
 * <p>Both classpath stream and JDBC connection are scoped with try-with-resources; infrastructure
 * failures are translated to a domain-specific report exception.</p>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class JasperFillService {

    private final DataSource dataSource;

    public JasperPrint fillReport(String jasperFileName, Map<String, Object> params) {
        log.debug("Filling report '{}' with params: {}", jasperFileName, params.keySet());

        try (InputStream jasperStream = getClass().getResourceAsStream("/reports/" + jasperFileName);
             Connection connection = dataSource.getConnection()) {

            if (jasperStream == null) {
                throw new IllegalStateException("Report file not found in classpath: " + jasperFileName);
            }

            return JasperFillManager.fillReport(jasperStream, params, connection);

        } catch (Exception e) {
            log.error("Error filling report '{}': {}", jasperFileName, e.getMessage());
            throw new JasperReportGenerationException("Error filling report: " + jasperFileName, e);
        }
    }
}
